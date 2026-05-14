::: IEEEkeywords
Large Language Models, Static Application Security Testing,
React,Cross-Site Scripting, Cybersecurity.
:::

# Abstract
The migration of rendering logic to the browser has increased the
prevalence of DOM-based cross-site scripting (DOM-based XSS) in
single-page applications (SPAs). This study evaluates whether large
language models (LLMs) can serve as practical static application
security testing (SAST) agents for React code and compares their
performance with deterministic rule-based baselines. The experiment
employs a paired dataset of 148 React components (74 vulnerable, 74
patched) covering four DOM-based XSS sink types. Four tools are
evaluated: Llama 3 (8B, local inference via Ollama), Gemini 2.5
Flash-Lite (cloud API, tested on a 74-component subset), Semgrep, and
ESLint. Llama 3 achieves 89.9\% accuracy with 18.9\% FPR and 1.4\%
FNR. Gemini 2.5 Flash-Lite achieves 98.6\% accuracy on successful
requests (FPR 0.0\%) but incurs two API-level failures, reducing
coverage. Semgrep and ESLint each achieve 98.0\% accuracy, 4.1\% FPR,
0.0\% FNR, and 100\% coverage. Deterministic baselines deliver
superior operational stability, while the cloud LLM provides the best
discrimination on completed requests. The findings motivate a hybrid
pipeline in which deterministic tools perform first-stage filtering and
LLM analysis provides contextual false-positive elimination.

# Introduction

The rapid adoption of Single-Page Applications (SPAs) built with
frameworks such as React has shifted significant portions of application
logic from the server to the client. This shift has concurrently altered
the threat landscape, notably increasing the attack surface for
DOM-based Cross-Site Scripting (DOM XSS). Unlike reflected or stored
XSS, DOM XSS occurs entirely within the browser when client-side
JavaScript processes data from an untrusted source and writes it to the
DOM without adequate sanitization[@b1]. Dangerous sinks in React
applications include `dangerouslySetInnerHTML`, direct `innerHTML`
assignment, `insertAdjacentHTML`, permissive `srcDoc` in iframes, and
unvalidated `postMessage` payloads.

Traditional SAST tools rely on predefined rules, control-flow, and
data-flow analysis. While deterministic and operationally stable, they
often struggle with the dynamic nature of modern JavaScript and
framework-specific rendering semantics, leading to elevated false
positive rates [@b2], [@b3], [@b4]. The emergence of LLMs presents a
novel approach: models trained on large code corpora can potentially
reason over source-to-sink paths and sanitization context without
requiring hand-authored signatures [@b5], [@b6], [@b7].

This study investigates the efficacy of LLMs as SAST agents for
detecting DOM-based XSS in React applications. We evaluate a local
open-weight model (Llama 3 8B), a cloud model (Gemini 2.5 Flash-Lite),
and two deterministic baselines (Semgrep, ESLint) on a paired dataset of
vulnerable and patched React components, quantifying the trade-offs
between AI-assisted and rule-based vulnerability detection.

**Contributions:** (1) A paired benchmark dataset of 148 React
components covering four DOM-based XSS sink types; (2) a unified
confusion-matrix evaluation of two LLM backends and two deterministic
baselines; (3) empirical evidence that a hybrid pipeline combining
deterministic filtering with LLM triage is preferable to either approach
alone.

# Methodology

## Dataset

A paired dataset of 148 React functional components was constructed: 74
containing deliberate, exploitable DOM-based XSS vulnerabilities and 74
corresponding patched versions. Each pair preserves business logic while
modifying only the security-relevant pathway.

Listing [\[lst:example\]](#lst:example){reference-type="ref"
reference="lst:example"} illustrates a typical paired component
(`ProfileBioPreview`) from the dataset. The vulnerable variant
improperly routes an untrusted URL parameter directly into the
`dangerouslySetInnerHTML` sink. The patched variant mitigates this by
utilizing a trusted sanitizer (e.g., DOMPurify).

``` {#lst:example caption="Example of a paired component in the dataset (\\texttt{ProfileBioPreview.jsx})." label="lst:example"}
// Vulnerable Component
 import React, { useMemo } from "react";
 export function ProfileBioPreview() {
   const draftBio = useMemo(
     () => localStorage.getItem("profile.bioDraft") ?? "",
     []
   );
   const previewHtml = useMemo(() => {
     return draftBio.replace(/\n/g, "<br />");
   }, [draftBio]);
   return (
     <section className="card">
       <h3>Bio Preview</h3>
       <p dangerouslySetInnerHTML={{ __html: previewHtml }} />
     </section>
   );
 }
}

// Patched Component
 import React, { useMemo } from "react";
 export function ProfileBioPreview() {
   const draftBio = useMemo(
     () => localStorage.getItem("profile.bioDraft") ?? "",
     []
   );
   return (
     <section className="card">
       <h3>Bio Preview</h3>
       <p style={{ whiteSpace: "pre-wrap" }}>{draftBio}</p>
     </section>
   );
 }
}
```

Other vulnerable sinks include `innerHTML` assignment,
`insertAdjacentHTML`, and permissive `srcDoc`. Untrusted sources include
`window.location.hash`, `document.referrer`, `postMessage` event data,
and `localStorage`. Patched variants employ JSX text-node binding,
explicit HTML escaping utilities, strict origin validation, and reduced
iframe sandbox attributes where applicable.

## Evaluated Tools

Four tools were applied to the dataset:

-   **Llama 3 (8B, local) [@b8]:** Served via Ollama at a local
    inference endpoint. Temperature 0.1; output constrained to JSON with
    keys `is_vulnerable`, `vulnerability_type`, and `reasoning`.

-   **Gemini 2.5 Flash-Lite (API) [@b9]:** Queried via the Google
    Generative Language REST API. Tested on a subset of 74 components
    due to API limits. Temperature 0.1; `responseMimeType` set to
    `application/json`. Exponential backoff with up to six retries on
    HTTP 429/5xx errors. The prompt included an explicit semantic
    guardrail stating that React's native JSX `{}` binding is safe
    against XSS; this guardrail was absent from the Llama prompt,
    constituting a methodological asymmetry discussed in Section IV
    (Threats to Validity).

-   **Semgrep:** Heuristic regex-pattern rules matching four dangerous
    sink patterns (`dangerouslySetInnerHTML`, `innerHTML` assignment,
    `insertAdjacentHTML`, `srcDoc`).

-   **ESLint:** Custom `no-restricted-syntax` AST selector rules
    targeting the same four sink patterns.

## Metrics

A unified confusion-matrix protocol is applied. Entries with
`is_vulnerable = null` (API or parsing failures) are counted as Errors
and excluded from Accuracy and rate denominators, but included in
Coverage and Effective Accuracy.

-   $\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$

-   $\text{FPR} = \frac{FP}{FP + TN}$

-   $\text{FNR} = \frac{FN}{FN + TP}$

-   $\text{Coverage} = \frac{TP + TN + FP + FN}{SampleSize}$

-   $\text{Effective Accuracy} = \frac{TP + TN}{SampleSize}$

# Results

Table [\[tab:results\]](#tab:results){reference-type="ref"
reference="tab:results"} presents the full confusion-matrix results
across all four tools.

::: center
[]{#tab:results label="tab:results"}
:::

## LLM Performance

**Llama 3 (8B)** achieved 89.9% accuracy with an 18.9% FPR. Analysis of
reasoning traces reveals occasional failure modes: context blindness to
React's JSX auto-escaping, leading to false positives where safe JSX
text nodes are flagged, and occasional hallucinated sink attribution.
However, it achieved excellent recall (1.4% FNR).

**Gemini 2.5 Flash-Lite** displayed 98.6% accuracy on successful API
calls (FPR 0.0%). Two requests failed after exhausting retries (HTTP
503), demonstrating that semantic quality and operational reliability
are orthogonal concerns. The explicit semantic guardrail in the prompt
effectively suppressed false positives related to native text escaping.

## Deterministic Baseline Performance

**Semgrep** and **ESLint** produced identical superior aggregate metrics
(Accuracy 98.0%, FPR 4.1%, FNR 0.0%, Coverage 100%). The three false
positives arise from patched components that retain the same sink tokens
as their vulnerable counterparts but with sanitization applied that
heuristic rules cannot distinguish. Both baselines achieved full
coverage with zero operational failures, confirming their suitability as
a reliable first-stage filter.

# Threats to Validity

**Limited sample size.** While N=148 is improved, it provides point
estimates; further scaling is required. Results should be treated as
indicative rather than conclusive.

**Synthetic dataset.** All components were generated from a controlled
prompt. This controls confounds but does not capture real-world code
distribution, multi-file dataflow, or co-occurring safe and unsafe
patterns.

**Prompt asymmetry between Llama 3 and Gemini 2.5 Flash-Lite.** The
Gemini prompt included an explicit semantic guardrail instructing the
model that React's native JSX `{}` text-node binding is inherently safe
against XSS injection; no equivalent guidance was provided to Llama 3.
Because the dominant false-positive mode for Llama 3 was precisely this
misclassification of safe JSX bindings, the guardrail gives Gemini a
structural advantage in FPR. Consequently, Gemini's reported FPR of 0.0%
should be interpreted as an upper bound on the model's intrinsic
discrimination ability under favourable prompting, rather than a fair
head-to-head comparison with Llama 3's 18.9% FPR. Future work should
equalize prompts across models (prompt ablation) to isolate model
capability from prompt engineering effects.

# Discussion and Conclusion

The new benchmark data highlights surprising parity and shifts in the
performance landscape compared to initial small-scale trials.
Deterministic baselines (Semgrep, ESLint) excel dramatically in
identifying vulnerabilities without failures, providing full-coverage
operation with a low false-positive rate (4.1%), challenging the
assumption of excessive false positives for well-tuned rules.

The local LLM achieved strong recall but at the cost of a moderately
higher false-positive rate. The cloud LLM achieves nearly perfect
precision but with reduced coverage and infrastructure dependency
leading to API errors.

These characteristics reinforce a hybrid pipeline design: deterministic
tools perform fast, reproducible first-stage filtering; only flagged
files are forwarded to LLM analysis for semantic disambiguation to
eliminate the remaining  4% false positives.

In summary: Semgrep and ESLint provide an exceptional operationally
stable baseline; Gemini 2.5 Flash-Lite achieves the best discrimination
on completed requests; Llama 3 8B provides high recall and acts as a
strong local alternative. Future work should scale the dataset to
real-world repositories, conduct repeated trials for statistical
confidence, perform prompt ablation, and evaluate the hybrid pipeline
end-to-end on CI/CD traffic.

# Data Availability {#data-availability .unnumbered}

All experimental artifacts (benchmark JSON logs, dataset source files,
evaluation scripts) are available at:
<https://github.com/DoubleS2xS/LLM-Agents-as-SAST-Tools>.
