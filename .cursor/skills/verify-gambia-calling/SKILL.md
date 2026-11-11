# Verify GambiaCalling
Gambia Calling - immersive PWA-style experience with service worker.
## Launch
Static; serve repo root over HTTP (playwright config uses npx http-server).
## Doctor
`python3 .cursor/skills/verify-gambia-calling/verify.py`
## Drive
Runs the playwright e2e specs on the chromium project (app, expanded a11y, CSP, history, loading, share - 17 tests). Dev server port overridable via PW_PORT/PW_BASE_URL; the skill uses 8182.
## Evidence
`.cursor/skills/verify-gambia-calling/evidence.json`
## Cleanup
Playwright manages its webServer.
## Known boundaries
firefox/webkit projects need their browsers installed; the repo historically committed node_modules - install fresh if specs cannot find the playwright CLI.
