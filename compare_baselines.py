import argparse
import json
import os
from typing import Dict, List, Tuple


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Aggregate LLM and rule-based baseline metrics into a single table."
    )
    parser.add_argument("--llama", default="benchmark_results.json", help="Path to Llama benchmark log")
    parser.add_argument("--gemini", default="gemini_benchmark_results.json", help="Path to Gemini benchmark log")
    parser.add_argument("--semgrep", default="baseline_semgrep_results.json", help="Path to Semgrep baseline summary")
    parser.add_argument("--eslint", default="baseline_eslint_results.json", help="Path to ESLint baseline summary")
    parser.add_argument(
        "--summary-output",
        default="compare_baselines_summary.json",
        help="Path to write normalized metrics JSON",
    )
    parser.add_argument(
        "--table-output",
        default="compare_baselines_table.md",
        help="Path to write markdown table",
    )
    return parser.parse_args()


def load_json(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def compute_confusion_from_log(log_entries: List[Dict]) -> Tuple[Dict[str, int], int]:
    metrics = {"TP": 0, "TN": 0, "FP": 0, "FN": 0, "Errors": 0}

    for entry in log_entries:
        true_label = entry.get("true_label")
        prediction = entry.get("prediction", {})
        is_vulnerable = prediction.get("is_vulnerable")

        if is_vulnerable is None:
            metrics["Errors"] += 1
            continue

        if true_label is True and is_vulnerable is True:
            metrics["TP"] += 1
        elif true_label is True and is_vulnerable is False:
            metrics["FN"] += 1
        elif true_label is False and is_vulnerable is True:
            metrics["FP"] += 1
        elif true_label is False and is_vulnerable is False:
            metrics["TN"] += 1
        else:
            metrics["Errors"] += 1

    return metrics, len(log_entries)


def compute_rates(metrics: Dict[str, int], sample_size: int) -> Dict[str, float]:
    total_eval = metrics["TP"] + metrics["TN"] + metrics["FP"] + metrics["FN"]
    accuracy = (metrics["TP"] + metrics["TN"]) / total_eval if total_eval else 0.0
    fpr = metrics["FP"] / (metrics["FP"] + metrics["TN"]) if (metrics["FP"] + metrics["TN"]) else 0.0
    fnr = metrics["FN"] / (metrics["FN"] + metrics["TP"]) if (metrics["FN"] + metrics["TP"]) else 0.0
    coverage = total_eval / sample_size if sample_size else 0.0
    effective_accuracy = (metrics["TP"] + metrics["TN"]) / sample_size if sample_size else 0.0

    return {
        "Accuracy": accuracy,
        "FPR": fpr,
        "FNR": fnr,
        "Coverage": coverage,
        "EffectiveAccuracy": effective_accuracy,
        "Total": total_eval,
        "SampleSize": sample_size,
    }


def normalize_llm_log(model_name: str, log_path: str) -> Dict:
    log_entries = load_json(log_path)
    metrics, sample_size = compute_confusion_from_log(log_entries)
    rates = compute_rates(metrics, sample_size)
    return {
        "Model": model_name,
        **metrics,
        **rates,
        "Source": os.path.basename(log_path),
    }


def normalize_baseline_summary(model_name: str, summary_path: str) -> Dict:
    raw = load_json(summary_path)
    metrics = raw.get("metrics", {})
    total_eval = int(metrics.get("Total", 0))
    errors = int(metrics.get("Errors", 0))
    sample_size = total_eval + errors
    rates = compute_rates(
        {
            "TP": int(metrics.get("TP", 0)),
            "TN": int(metrics.get("TN", 0)),
            "FP": int(metrics.get("FP", 0)),
            "FN": int(metrics.get("FN", 0)),
            "Errors": errors,
        },
        sample_size,
    )

    return {
        "Model": model_name,
        "TP": int(metrics.get("TP", 0)),
        "TN": int(metrics.get("TN", 0)),
        "FP": int(metrics.get("FP", 0)),
        "FN": int(metrics.get("FN", 0)),
        "Errors": errors,
        **rates,
        "Source": os.path.basename(summary_path),
    }


def render_markdown(rows: List[Dict]) -> str:
    header = "| Model | TP | TN | FP | FN | Errors | Accuracy | Coverage | Effective Accuracy | FPR | FNR |"
    sep = "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|"
    lines = [header, sep]

    for row in rows:
        lines.append(
            "| {Model} | {TP} | {TN} | {FP} | {FN} | {Errors} | {Accuracy:.1f}% | {Coverage:.1f}% | {EffectiveAccuracy:.1f}% | {FPR:.1f}% | {FNR:.1f}% |".format(
                Model=row["Model"],
                TP=row["TP"],
                TN=row["TN"],
                FP=row["FP"],
                FN=row["FN"],
                Errors=row["Errors"],
                Accuracy=row["Accuracy"] * 100,
                Coverage=row["Coverage"] * 100,
                EffectiveAccuracy=row["EffectiveAccuracy"] * 100,
                FPR=row["FPR"] * 100,
                FNR=row["FNR"] * 100,
            )
        )

    return "\n".join(lines) + "\n"


def main() -> None:
    args = parse_args()

    rows = [
        normalize_llm_log("Llama 3 (8B, local via Ollama)", args.llama),
        normalize_llm_log("Gemini 2.5 Flash-Lite (API)", args.gemini),
        normalize_baseline_summary("Semgrep baseline (rule-based)", args.semgrep),
        normalize_baseline_summary("ESLint baseline (rule-based)", args.eslint),
    ]

    summary = {"rows": rows}
    table_md = render_markdown(rows)

    with open(args.summary_output, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    with open(args.table_output, "w", encoding="utf-8") as f:
        f.write(table_md)

    print("Saved:", args.summary_output)
    print("Saved:", args.table_output)
    print("\n" + table_md)


if __name__ == "__main__":
    main()

