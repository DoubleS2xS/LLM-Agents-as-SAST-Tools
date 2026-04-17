# Benchmarking Large Language Models for Automated Detection of Client-Side Vulnerabilities in React Applications

## Abstract
Single-Page Application (SPA) frameworks have moved a significant portion of security-relevant logic to client-side JavaScript, increasing susceptibility to DOM-based Cross-Site Scripting (XSS) and insecure handling of browser-side data. This shift poses challenges for traditional static application security testing (SAST), which is often based on rule-driven Abstract Syntax Tree (AST) matching and may not capture React rendering semantics or data-flow context. This study benchmarks two large language model (LLM)-based analyzers (Llama 3 (8B), Gemini 2.5 Flash-Lite) and two deterministic baselines (Semgrep, ESLint) on a 20-component React benchmark with 10 vulnerable and 10 patched variants. A Python evaluation harness enforces strict JSON outputs for binary vulnerability classification and computes confusion-matrix metrics. Llama 3 (8B) achieves 55.0% accuracy (FPR = 90.0%, FNR = 0.0%). Gemini 2.5 Flash-Lite achieves 88.2% accuracy on non-error predictions (TP = 10, TN = 5, FP = 2, FN = 0), while three API-side rate-limit failures reduce coverage to 85.0% and effective accuracy across all 20 samples to 75.0%. Both Semgrep and ESLint baselines achieve TP = 10, TN = 7, FP = 3, FN = 0 (Accuracy = 85.0%, FPR = 30.0%, FNR = 0.0%). These results indicate that cloud LLM analysis can improve discrimination relative to local LLM inference, while deterministic baselines remain competitive and operationally stable.

## 1. Introduction
Modern web architectures increasingly rely on React-based SPAs, where user input is frequently transformed and rendered directly in the browser runtime. This architecture amplifies DOM-based XSS risk when attacker-controlled values are inserted into HTML sinks such as `innerHTML`, `insertAdjacentHTML`, `dangerouslySetInnerHTML`, or permissive `iframe srcDoc` contexts. In parallel, browser storage APIs such as `localStorage` and `sessionStorage` are often used for client state, and unsafe reuse of stored values in HTML rendering can produce persistent client-side injection paths.

Conventional SAST tools are highly effective for many server-side patterns but face limitations in componentized frontend systems. Rule-based and AST-centric pipelines tend to over-index on lexical indicators (e.g., URL query parsing, storage access, string templates) and under-model React semantics, especially JSX escaping rules and framework-level safe rendering defaults. As a result, these tools frequently over-report potential vulnerabilities in code that is safe by construction under React's rendering model.

LLM-based analysis offers an alternative inference mechanism: instead of fixed signatures, models can potentially reason over data flow, sink type, sanitization, and rendering context in a unified semantic space. This paper evaluates whether that promise translates into practical classification performance on client-side vulnerability detection tasks in React.

## 2. Methodology
### A. Dataset Construction
The benchmark dataset is a paired synthetic corpus of 20 React functional components:
- 10 vulnerable components in `dataset/vulnerable/`.
- 10 patched counterparts in `dataset/patched/`.

Each pair preserves business logic while modifying only the security-relevant pathway. Vulnerable variants implement DOM-based XSS via direct DOM sinks or unsafe HTML composition patterns. Patched variants replace unsafe sinks with React JSX binding, explicit escaping utilities, stricter origin checks for `postMessage`, reduced iframe capabilities, or sanitization (`DOMPurify` where applicable).

Representative vulnerable patterns include:
- query/referrer/hash values injected into HTML (`CheckoutPromoBanner.jsx`, `ReferralWelcomeCard.jsx`, `DocsPreviewFrame.jsx`),
- untrusted `postMessage` payload written to `innerHTML` (`EmbeddedChatNotice.jsx`, `SupportBannerToast.jsx`),
- `localStorage` content reflected through HTML sinks (`SavedFilterChip.jsx`, `ProfileBioPreview.jsx`).

### B. Evaluation Framework
Two Python drivers were used:
- `benchmark.py` (local Ollama endpoint, model `llama3`),
- `benchmark_gemini.py` (Google Gemini REST API, model `gemini-2.5-flash-lite`).

A deterministic baseline was additionally evaluated with `baseline_semgrep.py` using a Semgrep rule set (`semgrep/dom_xss_baseline.yml`) on the same 20 files.

A second deterministic baseline was evaluated with `baseline_eslint.py` using an ESLint configuration (`eslint/dom_xss_baseline.cjs`) on the same 20 files.

Both scripts evaluate all vulnerable files first, then all patched files, and record per-file JSON logs with schema:
`{"is_vulnerable": bool|null, "vulnerability_type": string|null, "reasoning": string}`.

Confusion-matrix metrics are computed identically in both scripts:
- TP/TN/FP/FN are updated only when `is_vulnerable` is `true` or `false`.
- Entries with `null` are counted as `Errors` and excluded from metric denominators.

### C. Prompt Engineering Strategy
Both prompts constrain the model to two vulnerability classes: DOM-based XSS and insecure client-side storage. Both require strict JSON-only output. The Gemini prompt additionally includes an explicit semantic guardrail: React native JSX `{}` binding is safe against direct XSS and benign UI state should not be treated as sensitive data. This prompt-level distinction is absent in `benchmark.py`, which helps explain the local model's over-reporting behavior on patched components. In the current run, the Gemini API model used was `gemini-2.5-flash-lite`.

## 3. Experimental Results
### A. Quantitative Results from JSON Logs
From `benchmark_results.json` (Llama 3, 20 entries):
- TP = 10, FN = 0, FP = 9, TN = 1.
- Accuracy = 55.0%.
- FPR = 90.0%.
- FNR = 0.0%.

From `gemini_benchmark_results.json` (Gemini 2.5 Flash-Lite, 20 entries):
- Non-error evaluated entries: TP = 10, FN = 0, FP = 2, TN = 5.
- Errors (`is_vulnerable = null`): 3 entries (HTTP 429 rate-limit failures after retries).
- Accuracy on non-error predictions: 88.2%.
- Coverage: 85.0%.
- Effective accuracy across all 20 entries: 75.0%.
- FPR = 28.6% and FNR = 0.0%.

From `baseline_semgrep_results.json` (Semgrep baseline, 20 entries):
- TP = 10, FN = 0, FP = 3, TN = 7.
- Accuracy = 85.0%.
- FPR = 30.0%.
- FNR = 0.0%.

From `baseline_eslint_results.json` (ESLint baseline, 20 entries):
- TP = 10, FN = 0, FP = 3, TN = 7.
- Accuracy = 85.0%.
- FPR = 30.0%.
- FNR = 0.0%.

| Model | TP | TN | FP | FN | Errors | Accuracy | FPR | FNR |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Llama 3 (8B, local via Ollama) | 10 | 1 | 9 | 0 | 0 | 55.0% | 90.0% | 0.0% |
| Gemini 2.5 Flash-Lite (API) | 10 | 5 | 2 | 0 | 3 | 88.2% | 28.6% | 0.0% |
| Semgrep baseline (rule-based) | 10 | 7 | 3 | 0 | 0 | 85.0% | 30.0% | 0.0% |
| ESLint baseline (rule-based) | 10 | 7 | 3 | 0 | 0 | 85.0% | 30.0% | 0.0% |

The Gemini metrics above are computed over successfully parsed predictions, while coverage and effective accuracy account for API failures.

### B. Qualitative Error Analysis (Reasoning Fields)
The reasoning traces in `benchmark_results.json` reveal two dominant failure modes for Llama 3:

1) **Context blindness to React-safe rendering**: patched components that read `window.location.search` or `document.referrer` were repeatedly flagged as XSS despite safe JSX interpolation (`{value}`) and no unsafe sink usage. For example, patched `CheckoutPromoBanner.jsx` was marked vulnerable solely due to unvalidated URL parameter presence, even though output is rendered through JSX text nodes.

2) **Sink hallucination and misplaced `dangerouslySetInnerHTML` attribution**: in several patched files (`ReferralWelcomeCard.jsx`, `EmbeddedChatNotice.jsx`, `DocsPreviewFrame.jsx`, `DocsSnippetPreviewFrame.jsx`), the model rationale claims dangerous sink usage that does not exist in the patched code. This indicates lexical prior over-fitting to vulnerability templates rather than grounded code-state reasoning.

Gemini rationales on successful samples show better sink-aware discrimination: it explicitly references HTML escaping (`escapeHtml`), JSX auto-escaping, and reduced iframe risk conditions. However, the same log contains three rate-limited requests that were not converted into predictions even after retries, indicating that semantic quality and operational reliability are orthogonal concerns in pipeline deployment.

## 4. Discussion and Conclusion
The benchmark demonstrates a substantial difference in precision between the evaluated local and cloud models. Llama 3 (8B) exhibits 100% recall on vulnerable samples but a high false-positive rate on patched code, which is consistent with a high-recall keyword or pattern scanner rather than a semantic analyzer for React data binding. Relative to this local LLM setup, both rule-based baselines (Semgrep and ESLint) and Gemini 2.5 Flash-Lite reduce false positives, with Gemini showing slightly higher discriminative performance on completed requests (FP = 2 vs. FP = 3 for both deterministic baselines). However, the Gemini path also introduces API-side reliability constraints that do not affect local rule execution.

Gemini 2.5 Flash-Lite demonstrates improved semantic discrimination on completed requests, separating many vulnerable sink paths from safe JSX or escaped rendering paths. Nevertheless, the remaining false positives on patched files and the presence of rate-limit failures indicate that model correctness must be evaluated jointly with system availability, quota management, and retry policy design.

Future work should combine semantic LLM reasoning with deterministic program analysis: (i) RAG over project-specific secure coding rules and known sink-source maps, (ii) AST-augmented prompting to anchor model judgments to explicit data-flow facts, and (iii) domain-specific fine-tuning of local models on frontend security corpora to reduce hallucinated sink attribution while preserving recall.

## References
[1] OWASP Foundation, "DOM Based XSS," OWASP Community, 2024. [Online]. Available: https://owasp.org/www-community/attacks/DOM_Based_XSS

[2] OWASP Foundation, "Cross Site Scripting Prevention Cheat Sheet," OWASP Cheat Sheet Series, 2024. [Online]. Available: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

[3] M. Martin, B. Livshits, and M. S. Lam, "Finding application errors and security flaws using PQL: a program query language," in *Proc. 20th ACM SIGPLAN Conf. Object-Oriented Programming, Systems, Languages, and Applications (OOPSLA)*, 2005, pp. 365-383.

[4] N. Ayewah, W. Pugh, J. D. Morgenthaler, J. Penix, and Y. Zhou, "Evaluating static analysis defect warnings on production software," in *Proc. 7th ACM Workshop on Program Analysis for Software Tools and Engineering (PASTE)*, 2007, pp. 1-8.

[5] M. Chen et al., "Evaluating large language models trained on code," *arXiv preprint arXiv:2107.03374*, 2021.

[6] S. Yao et al., "ReAct: Synergizing reasoning and acting in language models," in *Proc. 11th Int. Conf. Learning Representations (ICLR)*, 2023.

[7] C. M. Sadowski, J. van Gogh, C. Jaspan, E. Soderberg, and C. Winter, "Tricorder: Building a program analysis ecosystem," in *Proc. 37th Int. Conf. Software Engineering (ICSE)*, 2015, pp. 598-608.
