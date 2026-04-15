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
- `dataset/vulnerable` — vulnerable components.
- `dataset/patched` — fixed components.
- `paper` — paper materials.

## Requirements

- Python 3.9+
- `requests` package

Installation:

```bash
pip install requests
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

1. Specify the Gemini API key in `benchmark_gemini`.py.
2. Run:

```bash
python benchmark_gemini.py
```

Results are saved in:
- `gemini_benchmark_results.json`

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
``

## Limitations

- This is a research prototype, not a production SAST.
- Quality depends on the model, prompt, and API stability.
- For a fair comparison, it is recommended to use the same model and generation parameters.
