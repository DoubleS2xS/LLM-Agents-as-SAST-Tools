| Model | TP | TN | FP | FN | Errors | Accuracy | Coverage | Effective Accuracy | FPR | FNR |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Llama 3 (8B, local via Ollama) | 10 | 1 | 9 | 0 | 0 | 55.0% | 100.0% | 55.0% | 90.0% | 0.0% |
| Gemini 2.5 Flash-Lite (API) | 10 | 5 | 2 | 0 | 3 | 88.2% | 85.0% | 75.0% | 28.6% | 0.0% |
| Semgrep baseline (rule-based) | 10 | 7 | 3 | 0 | 0 | 85.0% | 100.0% | 85.0% | 30.0% | 0.0% |
| ESLint baseline (rule-based) | 10 | 7 | 3 | 0 | 0 | 85.0% | 100.0% | 85.0% | 30.0% | 0.0% |
