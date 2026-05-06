| Model | TP | TN | FP | FN | Errors | Accuracy | Coverage | Effective Accuracy | FPR | FNR |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Llama 3 (8B, local via Ollama) | 73 | 60 | 14 | 1 | 0 | 89.9% | 100.0% | 89.9% | 18.9% | 1.4% |
| Gemini 2.5 Flash-Lite (API) | 73 | 74 | 0 | 1 | 0 | 99.3% | 100.0% | 99.3% | 0.0% | 1.4% |
| Semgrep baseline (rule-based) | 74 | 71 | 3 | 0 | 0 | 98.0% | 100.0% | 98.0% | 4.1% | 0.0% |
| ESLint baseline (rule-based) | 74 | 71 | 3 | 0 | 0 | 98.0% | 100.0% | 98.0% | 4.1% | 0.0% |
