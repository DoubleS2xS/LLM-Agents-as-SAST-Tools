import argparse
import json
import os
import shutil
import subprocess
from typing import Dict, List, Tuple


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run ESLint baseline on dataset/vulnerable and dataset/patched."
    )
    parser.add_argument(
        "--dataset-dir",
        default="dataset",
        help="Path to dataset root containing vulnerable/ and patched/",
    )
    parser.add_argument(
        "--eslint-config",
        default="eslint/dom_xss_baseline.cjs",
        help="ESLint config file",
    )
    parser.add_argument(
        "--output",
        default="baseline_eslint_results.json",
        help="Path to save baseline results",
    )
    parser.add_argument(
        "--raw-output",
        default="eslint_raw_results.json",
        help="Path to save raw ESLint JSON",
    )
    return parser.parse_args()


def collect_dataset_files(dataset_dir: str) -> List[Dict]:
    records: List[Dict] = []
    for label_dir, true_label in (("vulnerable", True), ("patched", False)):
        folder = os.path.join(dataset_dir, label_dir)
        for name in sorted(os.listdir(folder)):
            if not name.endswith(".jsx"):
                continue
            abs_path = os.path.abspath(os.path.join(folder, name))
            records.append(
                {
                    "file": name,
                    "path": abs_path,
                    "true_label": true_label,
                }
            )
    return records


def _resolve_eslint_command() -> Tuple[List[str], Dict[str, str]]:
    env = os.environ.copy()
    local_bin = os.path.abspath("node_modules/.bin/eslint")

    if os.path.exists(local_bin):
        local_dir = os.path.dirname(local_bin)
        env["PATH"] = f"{local_dir}:{env.get('PATH', '')}"
        return [local_bin], env

    eslint_bin = shutil.which("eslint")
    if eslint_bin:
        return [eslint_bin], env

    npx_bin = shutil.which("npx")
    if npx_bin:
        return [npx_bin, "--yes", "eslint"], env

    raise RuntimeError(
        "ESLint not found. Install dependencies via `npm install` or provide eslint in PATH."
    )


def run_eslint(config_path: str, dataset_dir: str) -> List[Dict]:
    base_cmd, env = _resolve_eslint_command()
    cmd = [
        *base_cmd,
        "--no-eslintrc",
        "--config",
        config_path,
        "--ext",
        ".jsx",
        "--format",
        "json",
        "--no-error-on-unmatched-pattern",
        dataset_dir,
    ]

    completed = subprocess.run(cmd, capture_output=True, text=True, env=env)
    if completed.returncode not in (0, 1):
        raise RuntimeError(
            "ESLint failed with exit code "
            f"{completed.returncode}: {completed.stderr.strip()}"
        )

    try:
        return json.loads(completed.stdout)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            "Failed to decode ESLint output as JSON. "
            f"stderr={completed.stderr.strip()}"
        ) from exc


def evaluate(records: List[Dict], eslint_json: List[Dict]) -> Dict:
    findings_by_path: Dict[str, List[Dict]] = {}
    for file_report in eslint_json:
        path = os.path.abspath(file_report.get("filePath", ""))
        messages = file_report.get("messages", [])
        if messages:
            findings_by_path[path] = messages

    metrics = {"TP": 0, "FP": 0, "TN": 0, "FN": 0, "Errors": 0}
    results_log: List[Dict] = []

    for record in records:
        file_findings = findings_by_path.get(record["path"], [])
        predicted = len(file_findings) > 0

        if record["true_label"] and predicted:
            metrics["TP"] += 1
        elif record["true_label"] and not predicted:
            metrics["FN"] += 1
        elif (not record["true_label"]) and predicted:
            metrics["FP"] += 1
        else:
            metrics["TN"] += 1

        results_log.append(
            {
                "file": record["file"],
                "true_label": record["true_label"],
                "prediction": {
                    "is_vulnerable": predicted,
                    "tool": "eslint",
                    "match_count": len(file_findings),
                    "rule_ids": sorted({m.get("ruleId") for m in file_findings if m.get("ruleId")}),
                },
            }
        )

    total = metrics["TP"] + metrics["TN"] + metrics["FP"] + metrics["FN"]
    accuracy = (metrics["TP"] + metrics["TN"]) / total if total else 0.0
    fpr = metrics["FP"] / (metrics["FP"] + metrics["TN"]) if (metrics["FP"] + metrics["TN"]) else 0.0
    fnr = metrics["FN"] / (metrics["FN"] + metrics["TP"]) if (metrics["FN"] + metrics["TP"]) else 0.0

    return {
        "tool": "eslint",
        "metrics": {
            **metrics,
            "Accuracy": round(accuracy, 4),
            "FPR": round(fpr, 4),
            "FNR": round(fnr, 4),
            "Total": total,
        },
        "results": results_log,
    }


def main() -> None:
    args = parse_args()

    records = collect_dataset_files(args.dataset_dir)
    eslint_json = run_eslint(args.eslint_config, args.dataset_dir)
    report = evaluate(records, eslint_json)

    with open(args.raw_output, "w", encoding="utf-8") as f:
        json.dump(eslint_json, f, indent=2, ensure_ascii=False)

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    m = report["metrics"]
    print("=" * 40)
    print("ESLint baseline metrics")
    print("=" * 40)
    print(f"TP={m['TP']} TN={m['TN']} FP={m['FP']} FN={m['FN']}")
    print(f"Accuracy={m['Accuracy'] * 100:.1f}%")
    print(f"FPR={m['FPR'] * 100:.1f}%")
    print(f"FNR={m['FNR'] * 100:.1f}%")
    print(f"Saved: {args.output}")
    print(f"Saved raw: {args.raw_output}")


if __name__ == "__main__":
    main()

