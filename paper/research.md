# Application of Large Language Models for Automated Client-Side Vulnerability Detection in React Applications

## Abstract
The migration of rendering logic to the browser has increased the relevance of DOM-based cross-site scripting (DOM-based XSS) in single-page applications (SPAs). This study evaluates whether large language models (LLMs) can serve as practical SAST agents for React code and compares their performance with deterministic rule-based baselines. The experiment uses a paired dataset of 20 components (10 vulnerable and 10 patched). We evaluate Llama 3 (8B, local), Gemini 2.5 Flash-Lite (API), a Semgrep baseline, and an ESLint baseline. From current repository logs, Llama 3 achieves TP=10, TN=1, FP=9, FN=0 (Accuracy 55.0%, FPR 90.0%, FNR 0.0%). Gemini 2.5 Flash-Lite achieves TP=10, TN=5, FP=2, FN=0, Errors=3 (Accuracy 88.2% on non-error predictions, Coverage 85.0%, Effective Accuracy 75.0%, FPR 28.6%, FNR 0.0%). Semgrep and ESLint both achieve TP=10, TN=7, FP=3, FN=0 (Accuracy 85.0%, FPR 30.0%, FNR 0.0%). Results indicate that the cloud LLM provides the best discrimination on completed requests, while rule-based baselines remain competitive and more operationally stable.

## Index Terms
Large language models, static application security testing, React, DOM-based XSS, DevSecOps, vulnerability detection.

## I. Introduction
Web applications have shifted from server-side HTML generation to SPA architectures in which critical logic executes on the client. In React, this creates a dual reality: built-in protections such as JSX auto-escaping coexist with unavoidable use of risky primitives in some business scenarios (for example, `dangerouslySetInnerHTML`, `innerHTML`, `srcDoc`, and cross-frame messaging).

Traditional SAST tools remain fast and reproducible, but frontend security analysis often exhibits a precision-recall trade-off. LLM-based analysis may improve semantic source-to-sink reasoning, yet introduces infrastructure risks such as API availability, quota limits, and cost volatility.

The objective of this study is to compare local LLM, cloud LLM, and rule-based baselines on the same dataset under a unified metric protocol.

## II. Related Work
Foundational work on abstract interpretation established the theoretical basis for static analysis [1], while practical guidance and taxonomies for XSS remain centered around OWASP materials [2], [3]. React-specific vulnerability mining further documented component-graph attack surfaces in modern frontends [4]. Prior work on SAST and taint analysis reports limitations of file-level and flow-insensitive approaches for dynamic JavaScript code [5], [6]. Transformer-based code models (for example, CodeBERT and GraphCodeBERT) demonstrated stronger semantic modeling of dependencies [7], [8]. Recent AppSec workflows combine LLM reasoning with retrieval or multi-agent orchestration to reduce hallucinations and increase practical utility [9], [10]. Model-family and platform references are documented in [11]-[13], and recent synthesis work is provided in [14].

## III. Methodology
### A. Dataset
We use a paired dataset of 20 React components:
- `dataset/vulnerable/`: 10 vulnerable components;
- `dataset/patched/`: 10 patched counterparts.

The pairs cover representative DOM XSS patterns involving dangerous sinks (`innerHTML`, `insertAdjacentHTML`, `dangerouslySetInnerHTML`, `srcDoc`) and untrusted sources (`window.location`, `document.referrer`, `postMessage`, `localStorage`).

### B. Evaluated Tools
- `benchmark.py`: Llama 3 (8B, local via Ollama).
- `benchmark_gemini.py`: Gemini 2.5 Flash-Lite (API).
- `baseline_semgrep.py`: Semgrep baseline.
- `baseline_eslint.py`: ESLint baseline.

### C. Metrics
A unified confusion-matrix protocol is used across all tools: TP, TN, FP, FN, Errors.

- Accuracy = (TP + TN) / (TP + TN + FP + FN)
- FPR = FP / (FP + TN)
- FNR = FN / (FN + TP)
- Coverage = (TP + TN + FP + FN) / SampleSize
- Effective Accuracy = (TP + TN) / SampleSize

## IV. Experimental Results
### A. Synchronization with Current JSON Artifacts
All values below are synchronized with:
`benchmark_results.json`, `gemini_benchmark_results.json`, `baseline_semgrep_results.json`, `baseline_eslint_results.json`, and `compare_baselines_summary.json`.

### B. Unified Baseline Table
| Model | TP | TN | FP | FN | Errors | Accuracy | Coverage | Effective Accuracy | FPR | FNR |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Llama 3 (8B, local via Ollama) | 10 | 1 | 9 | 0 | 0 | 55.0% | 100.0% | 55.0% | 90.0% | 0.0% |
| Gemini 2.5 Flash-Lite (API) | 10 | 5 | 2 | 0 | 3 | 88.2%* | 85.0% | 75.0% | 28.6% | 0.0% |
| Semgrep baseline (rule-based) | 10 | 7 | 3 | 0 | 0 | 85.0% | 100.0% | 85.0% | 30.0% | 0.0% |
| ESLint baseline (rule-based) | 10 | 7 | 3 | 0 | 0 | 85.0% | 100.0% | 85.0% | 30.0% | 0.0% |

*Gemini Accuracy is computed on non-error predictions only.

### C. Interpretation
- Llama 3 yields maximum recall (FNR=0.0%) but an impractically high FPR (90.0%).
- Gemini 2.5 Flash-Lite provides the lowest FP among completed requests, but has reduced operational reliability due to Errors=3.
- Semgrep and ESLint deliver the same compromise: slightly worse FP than Gemini, but full coverage and no service-level failures.

## V. Threats to Validity
1. **Small sample size.** A 20-file dataset is insufficient for broad industry-level generalization.
2. **Synthetic pairing bias.** Paired vulnerable/patched files are controlled but do not fully represent production repository noise.
3. **Infrastructure coupling.** For Gemini, model quality and API reliability are inseparable in practice.
4. **Rule-set limitations.** Baseline performance depends on rule quality and does not fully capture deep cross-module semantics.

## VI. Discussion
The results support a hybrid DevSecOps design: use a fast deterministic filter (Semgrep/ESLint) as stage one and apply LLM analysis as stage two for difficult cases. This reduces alert noise compared to a local LLM-only pipeline while also reducing dependence on external API uptime.

For CI/CD, this hybrid design provides a practical balance: baselines maximize throughput and reproducibility, while LLMs add semantic depth for triage and prioritization.

## Data Availability Statement
Experimental artifacts are available in this repository (`benchmark_results.json`, `gemini_benchmark_results.json`, `baseline_semgrep_results.json`, `baseline_eslint_results.json`, `compare_baselines_summary.json`, `compare_baselines_table.md`). A DOI-backed archival release is planned for camera-ready submission.

## VII. Conclusion
In the current experiment, the cloud LLM (Gemini 2.5 Flash-Lite) achieves the best discrimination on completed requests, but with reduced coverage due to API errors. The local LLM (Llama 3 8B) achieves zero FNR at the cost of high false positives. Rule-based baselines (Semgrep/ESLint) provide stable and reproducible performance (85.0% accuracy, 30.0% FPR, 0.0% FNR).

The next step is to scale the dataset, run repeated trials with confidence intervals, and evaluate hybrid baseline+LLM orchestration on real repositories and pull request streams.

## References
[1] P. Cousot and R. Cousot, "Abstract interpretation: A unified lattice model for static analysis of programs by construction or approximation of fixpoints," in *Proc. 4th ACM SIGACT-SIGPLAN Symp. Principles of Programming Languages (POPL)*, 1977, pp. 238-252, doi: 10.1145/512950.512973.

[2] OWASP Foundation, "DOM Based XSS," 2024. [Online]. Available: https://owasp.org/www-community/attacks/DOM_Based_XSS. Accessed: Apr. 18, 2026.

[3] OWASP Foundation, "Cross Site Scripting Prevention Cheat Sheet," 2024. [Online]. Available: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html. Accessed: Apr. 18, 2026.

[4] Z. Guo, M. Kang, V. Venkatakrishnan, R. Gjomemo, and Y. Cao, "ReactAppScan: Mining React application vulnerabilities via component graph," in *Proc. ACM SIGSAC Conf. Comput. Commun. Secur. (CCS)*, 2024.

[5] S. Diwangkara and Y. Cao, "TranSPArent: Taint-style vulnerability detection in generic single page applications," in *Proc. Network Distrib. Syst. Secur. Symp. (NDSS)*, 2024.

[6] N. Ayewah, W. Pugh, J. D. Morgenthaler, J. Penix, and Y. Zhou, "Evaluating static analysis defect warnings on production software," in *Proc. ACM Workshop Program Anal. Softw. Tools Eng. (PASTE)*, 2007.

[7] M. Feng et al., "CodeBERT: A Pre-Trained Model for Programming and Natural Languages," arXiv:2002.08155, 2020.

[8] D. Guo et al., "GraphCodeBERT: Pre-training Code Representations with Data Flow," arXiv:2009.08366, 2021.

[9] S. Halder et al., "SecLens: Role-Specific Evaluation of LLMs for Security Vulnerability Detection," arXiv:2604.01637, 2026.

[10] Z. Liang et al., "Argus: Reorchestrating Static Analysis via a Multi-Agent Ensemble for Full-Chain Security Vulnerability Detection," arXiv:2604.06633, 2026.

[11] T. Grattafiori et al., "The Llama 3 Herd of Models," arXiv:2407.21783, 2024.

[12] G. Comanici et al., "Gemini 2.5: Pushing the Frontier with Advanced Reasoning, Multimodality, Long Context, and Next Generation Agentic Capabilities," arXiv:2507.06261, 2025.

[13] Google Cloud, "Gemini 2.5 Flash model documentation," 2026. [Online]. Available: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash. Accessed: Apr. 18, 2026.

[14] L. B. Germano et al., "Systematic Review on Detection, Repair, and Explanation of Vulnerabilities in Source Code Using Large Language Models," *IEEE Access*, vol. 13, 2025.
