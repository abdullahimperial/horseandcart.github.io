# Instructions for Let’s Fix Money contributors

## Owner’s standing instruction — 14 November 2026

Use a repository-first workflow. Document all changes in code, README or appropriate project documentation according to software engineering practice. The repository itself must contain enough context to continue. Keep this instruction in the repository. Do not depend on a ChatGPT window or its history, because sessions can end abruptly.

This applies to human contributors and coding assistants throughout this repository. Current explicit user instructions take precedence; record durable decisions for the next contributor.

## Start each task

1. Read this file, `README.md`, `docs/PROJECT_STATUS.md` and the relevant component README. Consult `docs/ARCHITECTURE.md` and `docs/DEVELOPMENT.md`.
2. Inspect Git status, branch, recent commits and the remote head. Fetch before relying on a local copy. Preserve uncommitted work. Never reset or force-push shared work to match an old session.
3. Use current repository source and recorded references. Do not reconstruct from screenshots, ZIPs or memory when the repository exists. Do not ask the owner to repeat information already documented here.
4. Check relevant baseline tests and CI status. Separate existing failures from regressions; keep changes scoped to the request and necessary fixes.

## Work and checkpoint rules

- Make focused changes. Keep calculations separate from presentation. Comment non-obvious assumptions, units and decisions rather than narrating each line.
- Update component documentation when behavior, dependencies or commands change. Record structural decisions in the architecture guide.
- Add meaningful regression coverage for changed calculations, imports, saved formats, language boundaries and native adapters. Documentation-only changes need link/command review rather than artificial tests.
- Use fictional financial fixtures. This repository is public: never commit statements, private notes, credentials, tokens, signing keys or signing backups. Document required configuration without secret values.
- Keep one financial engine. Android generates its bundle from the web app; do not fork the calculations or edit generated assets. Include required dependencies and licences for offline use.
- Save a checkpoint after meaningful batches and before long builds, uploads or interruption. Record the active goal, changed paths, decisions, checks, unresolved issues and exact next step in `docs/PROJECT_STATUS.md`. Commit and push an authorized work branch when appropriate so incomplete work survives the session.
- Keep the changelog and status accurate. “Not run,” “blocked,” “failed” and “passed” are different outcomes.

## Product rules to preserve

- Framework: Understand → Save → Build Resilience → Preserve → Grow → Transfer → Give. Lessons must work without the book, with complete explanations, visual consequences, practice and useful takeaways.
- Preserve the author’s practical, conversational voice and restrained professional style. Motion should teach; support phones, keyboard use and reduced motion. The homepage begins with “Personal finance framework” before its spiral and retains replay/skip behavior.
- Purchases count once. Credit-card settlements remain visible as transfers, excluded from spending/income. Interest and fees remain spending; purchase refunds reduce it. Do not deduplicate by amount alone or discard unclear entries. Preserve coverage and review requirements.
- Distinguish cash flow from net worth, prepaid bills from accessible cash, recurring savings from one-time offers, principal cash obligations from financing costs, and grants/contributions from investment returns. Preserve unknowns and visible assumptions.
- Money Snapshot remains local and CAD-only. Do not implicitly add bank connections, accounts, uploads, transaction analytics or an AI API. Preserve saved-plan compatibility and stale-report protection.
- English remains the initial default. Urdu should convey the edited manuscript’s meaning naturally. Update both languages when changing authored copy. Preserve placeholders, amounts, input/category values, raw data, notes and game/course state when switching. Keep numbers/equations legible in RTL.
- Preserve course progress/workbooks, all activities and existing deep links or redirects.
- Preserve original game artwork and intended rules. Check current game code/tests against verified manuscript sources before changing rules; historical notes can describe older revisions.
- Retain educational/privacy notices, the distinction between a local inquiry draft and a sent message, and third-party font/data attribution.

## Finish each task

1. Run `python3 scripts/check.py` and the checks appropriate to the change. Check both languages and relevant layouts for UI changes; run Android CI for Android changes. Do not present a unit test as browser/device verification.
2. Update the affected README, `CHANGELOG.md` and `docs/PROJECT_STATUS.md`. Include rationale, verification, limitations and the next concrete action. Keep the current checkpoint concise; history belongs in the changelog.
3. Review the diff and stage intended paths only. Check for unrelated changes, accidental private/build artifacts and lost functionality.
4. Commit and push within the authorized scope. If the remote advanced, reconcile instead of overwriting it. Check workflows for the exact commit: a push is not proof of deployment or APK success.
5. Give the user repository/commit and relevant result links. The final reply summarizes the work; it must never be the only handover.
