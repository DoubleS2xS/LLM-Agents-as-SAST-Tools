import argparse
import json
import os
import shutil
import subprocess
import sys
from typing import Dict, List


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run Semgrep baseline on dataset/vulnerable and dataset/patched."
    )
    parser.add_argument(
        "--dataset-dir",
        default="dataset",
        help="Path to dataset root containing vulnerable/ and patched/",
    )
    parser.add_argument(
        "--semgrep-config",
        default="semgrep/dom_xss_baseline.yml",
        help="Semgrep rules config file",
    )
    parser.add_argument(
        "--output",
        default="baseline_semgrep_results.json",
        help="Path to save baseline results",
    )
    parser.add_argument(
        "--raw-output",
        default="semgrep_raw_results.json",
        help="Path to save raw Semgrep JSON",
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


def run_semgrep(config_path: str, dataset_dir: str) -> Dict:
    semgrep_bin = shutil.which("semgrep")
    if not semgrep_bin:
        py_ver = f"{sys.version_info.major}.{sys.version_info.minor}"
        candidate = os.path.expanduser(f"~/Library/Python/{py_ver}/bin/semgrep")
        if os.path.exists(candidate):
            semgrep_bin = candidate

    if not semgrep_bin:
        raise RuntimeError(
            "Semgrep binary not found in PATH. "
            "Install Semgrep and ensure `semgrep` is available in PATH."
        )

    cmd = [
        semgrep_bin,
        "--config",
        config_path,
        "--json",
        "--quiet",
        dataset_dir,
    ]
    env = os.environ.copy()
    semgrep_dir = os.path.dirname(semgrep_bin)
    env["PATH"] = f"{semgrep_dir}:{env.get('PATH', '')}"
    completed = subprocess.run(cmd, capture_output=True, text=True, env=env)

    if completed.returncode not in (0, 1):
        raise RuntimeError(
            "Semgrep failed with exit code "
            f"{completed.returncode}: {completed.stderr.strip()}"
        )

    try:
        return json.loads(completed.stdout)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            "Failed to decode Semgrep output as JSON. "
            f"stderr={completed.stderr.strip()}"
        ) from exc


def evaluate(records: List[Dict], semgrep_json: Dict) -> Dict:
    findings_by_path: Dict[str, List[Dict]] = {}
    for finding in semgrep_json.get("results", []):
        path = os.path.abspath(finding.get("path", ""))
        findings_by_path.setdefault(path, []).append(finding)

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
                    "tool": "semgrep",
                    "match_count": len(file_findings),
                    "rule_ids": sorted({f.get("check_id") for f in file_findings}),
                },
            }
        )

    total = metrics["TP"] + metrics["TN"] + metrics["FP"] + metrics["FN"]
    accuracy = (metrics["TP"] + metrics["TN"]) / total if total else 0.0
    fpr = metrics["FP"] / (metrics["FP"] + metrics["TN"]) if (metrics["FP"] + metrics["TN"]) else 0.0
    fnr = metrics["FN"] / (metrics["FN"] + metrics["TP"]) if (metrics["FN"] + metrics["TP"]) else 0.0

    return {
        "tool": "semgrep",
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
    semgrep_json = run_semgrep(args.semgrep_config, args.dataset_dir)
    report = evaluate(records, semgrep_json)

    with open(args.raw_output, "w", encoding="utf-8") as f:
        json.dump(semgrep_json, f, indent=2, ensure_ascii=False)

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    m = report["metrics"]
    print("=" * 40)
    print("Semgrep baseline metrics")
    print("=" * 40)
    print(f"TP={m['TP']} TN={m['TN']} FP={m['FP']} FN={m['FN']}")
    print(f"Accuracy={m['Accuracy'] * 100:.1f}%")
    print(f"FPR={m['FPR'] * 100:.1f}%")
    print(f"FNR={m['FNR'] * 100:.1f}%")
    print(f"Saved: {args.output}")
    print(f"Saved raw: {args.raw_output}")


if __name__ == "__main__":
    main()




