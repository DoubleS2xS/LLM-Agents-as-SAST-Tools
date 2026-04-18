# Application of Large Language Models for Automated Client-Side Vulnerability Detection in React Applications (Conference Short Version)

## Abstract
This paper evaluates large language models (LLMs) as SAST agents for React client-side vulnerability detection and compares them against deterministic baselines. We use a paired dataset of 20 components (10 vulnerable, 10 patched) and evaluate Llama 3 (8B, local), Gemini 2.5 Flash-Lite (API), Semgrep baseline, and ESLint baseline. Results show: Llama 3 (TP=10, TN=1, FP=9, FN=0; Accuracy 55.0%, FPR 90.0%, FNR 0.0%), Gemini 2.5 Flash-Lite (TP=10, TN=5, FP=2, FN=0, Errors=3; Accuracy 88.2% on non-error predictions, Coverage 85.0%, Effective Accuracy 75.0%), and Semgrep/ESLint (TP=10, TN=7, FP=3, FN=0; Accuracy 85.0%, FPR 30.0%, FNR 0.0%). The cloud LLM yields the best discrimination on completed requests, while rule-based baselines provide stronger operational stability.

## Index Terms
Large language models, static application security testing, React, DOM-based XSS, DevSecOps.

## I. Introduction
DOM-based XSS remains a persistent issue in SPA architectures where client-side logic handles untrusted data and writes to dangerous DOM sinks. React provides built-in escaping for standard JSX bindings, but real applications still require risky primitives such as `dangerouslySetInnerHTML`, `innerHTML`, and `srcDoc`.

Traditional SAST tools are efficient and reproducible but may over- or under-report in complex frontend dataflow scenarios. LLM-based analysis may improve semantic reasoning, but practical deployments also depend on API reliability and cost.

This work compares local LLM, cloud LLM, and rule-based baselines using one dataset and one metric protocol.

## II. Methodology
### A. Dataset
We use 20 paired React components:
- `dataset/vulnerable/` (10 files)
- `dataset/patched/` (10 files)

The dataset includes typical DOM XSS patterns involving source-to-sink flows from `window.location`, `document.referrer`, `postMessage`, and `localStorage` into `innerHTML`-class sinks.

### B. Tools
- Llama 3 (8B, local via `benchmark.py`)
- Gemini 2.5 Flash-Lite (API via `benchmark_gemini.py`)
- Semgrep baseline (`baseline_semgrep.py`)
- ESLint baseline (`baseline_eslint.py`)

### C. Metrics
We report TP, TN, FP, FN, Errors and derive:
- Accuracy = (TP + TN) / (TP + TN + FP + FN)
- FPR = FP / (FP + TN)
- FNR = FN / (FN + TP)
- Coverage = (TP + TN + FP + FN) / SampleSize
- Effective Accuracy = (TP + TN) / SampleSize

## III. Results
| Model | TP | TN | FP | FN | Errors | Accuracy | Coverage | Effective Accuracy | FPR | FNR |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Llama 3 (8B, local) | 10 | 1 | 9 | 0 | 0 | 55.0% | 100.0% | 55.0% | 90.0% | 0.0% |
| Gemini 2.5 Flash-Lite (API) | 10 | 5 | 2 | 0 | 3 | 88.2%* | 85.0% | 75.0% | 28.6% | 0.0% |
| Semgrep baseline | 10 | 7 | 3 | 0 | 0 | 85.0% | 100.0% | 85.0% | 30.0% | 0.0% |
| ESLint baseline | 10 | 7 | 3 | 0 | 0 | 85.0% | 100.0% | 85.0% | 30.0% | 0.0% |

*Gemini Accuracy is computed on non-error predictions only.

## IV. Discussion
The experiment reveals three practical outcomes. First, the local LLM shows high recall but unacceptable false-positive behavior for autonomous CI/CD blocking. Second, the cloud LLM shows the best discrimination on successful responses but reduced operational reliability due to API errors. Third, deterministic baselines provide balanced and stable behavior with full coverage.

A practical architecture is a hybrid pipeline: baseline filtering in stage one and LLM triage in stage two.

## V. Threats to Validity
- Small dataset (20 files).
- Synthetic paired structure may not capture full production noise.
- Gemini quality is coupled with infrastructure availability.
- Rule quality constrains baseline performance.

## VI. Conclusion
Gemini 2.5 Flash-Lite achieves the best discrimination on completed requests; Semgrep/ESLint deliver stable and reproducible baseline performance; Llama 3 (8B) provides high recall with high false positives. Future work will scale the dataset, add repeated runs with confidence intervals, and evaluate hybrid baseline+LLM workflows on real repository traffic.

## Data Availability Statement
All experiment artifacts are in this repository: `benchmark_results.json`, `gemini_benchmark_results.json`, `baseline_semgrep_results.json`, `baseline_eslint_results.json`, `compare_baselines_summary.json`, and `compare_baselines_table.md`.

