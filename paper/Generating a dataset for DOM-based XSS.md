Prompt: Act as a Senior Frontend Security Engineer. Your task is to generate a synthetic benchmark dataset of React components for evaluating SAST tools.

Generate 5 distinct, highly realistic React functional components. For each component, provide TWO versions:

Vulnerable Version: Contains a subtle DOM-based XSS vulnerability (e.g., unsafe use of dangerouslySetInnerHTML, improper handling of window.location.search, unsafe useRef direct DOM manipulation, or improper sanitization of third-party props).

Patched Version: The exact same component, but the vulnerability is correctly mitigated (e.g., using DOMPurify, React's native data binding, or safe URL parsing).

Strict constraints:

Use modern React syntax (Hooks, functional components).

Make the business logic look like real enterprise code (e.g., User Profile widget, Data Table formatter, Markdown Previewer, URL router component).

Do not include obvious comments like // VULNERABLE HERE. The vulnerabilities should require semantic understanding to detect.

Format the output strictly as follows for each of the 5 pairs:

Component [N]: [Name of Component]
Vulnerability Type: [Brief description]

Vulnerable Code:
JavaScript
// code here

Patched Code:
JavaScript
// code here