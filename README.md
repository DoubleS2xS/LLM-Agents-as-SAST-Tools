# LLM-Agents-as-SAST-Tools

A small research repository for testing the ability of LLMs to act as SAST agents when analyzing React components.

## What the project does

- Generates a dataset from pairs:
- `vulnerable` (vulnerable code)
- `patched` (patched code)
- Runs this dataset through LLM
- Calculates quality metrics:
- Accuracy
- False Positive Rate (FPR)
- False Negative Rate (FNR)

## Repository Structure

- `parser.py` — parser of raw Markdown output into `.jsx` dataset files.
- `benchmark.py` — benchmark via the local Ollama model.
- `benchmark_gemini.py` — benchmark via the Gemini API.
- `baseline_semgrep.py` — deterministic Semgrep baseline on the same dataset.
- `baseline_eslint.py` — deterministic ESLint baseline on the same dataset.
- `compare_baselines.py` — aggregates LLM + baseline metrics into one summary table.
- `semgrep/dom_xss_baseline.yml` — Semgrep rules for baseline detection.
- `eslint/dom_xss_baseline.cjs` — ESLint config for sink-oriented baseline rules.
- `dataset/vulnerable` — vulnerable components.
- `dataset/patched` — fixed components.
- `paper` — paper materials.

## Requirements

- Python 3.9+
- `requests` package
- `semgrep` (for rule-based baseline)
- Node.js 18+ (for ESLint baseline)

Installation:

```bash
pip install requests
```

For baseline:

```bash
python3 -m pip install --user semgrep
cd /Users/doubles/Desktop/GITHUB\ PROJECTS/LLM-Agents-as-SAST-Tools
npm install
```

## Preparing the dataset (optional)

If you need to reparse the raw markdown:

```bash
python parser.py raw_output.md
```

The script will create/append `dataset/vulnerable` and `dataset/patched`.

## Running the benchmark: Ollama

1. Install and run Ollama.
2. Download the model (by default, `llama3` is specified in the code).
3. Run:

```bash
python benchmark.py
```

Results are saved in:
- `benchmark_results.json`

## Running the benchmark: Gemini

1. Set Gemini API key as environment variable.
2. Run:

```bash
export GEMINI_API_KEY='YOUR_KEY'
python benchmark_gemini.py
```

Results are saved in:
- `gemini_benchmark_results.json`

## Running baseline: Semgrep

Run Semgrep on the same 20 files and compute TP/FP/TN/FN:

```bash
python3 baseline_semgrep.py
```

Results are saved in:
- `baseline_semgrep_results.json`
- `semgrep_raw_results.json`

## Running baseline: ESLint

Run ESLint on the same 20 files and compute TP/FP/TN/FN:

```bash
python3 baseline_eslint.py
```

Results are saved in:
- `baseline_eslint_results.json`
- `eslint_raw_results.json`

## Build one comparison table

Generate a unified comparison for Llama, Gemini, Semgrep, and ESLint:

```bash
python3 compare_baselines.py
```

Artifacts:
- `compare_baselines_summary.json`
- `compare_baselines_table.md`

## Result format

Each log element:

```json
{
"file": "Component.jsx",
"true_label": true,
"prediction": {
"is_vulnerable": true,
"vulnerability_type": "DOM XSS via dangerouslySetInnerHTML",
"reasoning": "..."
}
}
```

## Limitations

- This is a research prototype, not a production SAST.
- Quality depends on the model, prompt, and API stability.
- For a fair comparison, it is recommended to use the same model and generation parameters.
