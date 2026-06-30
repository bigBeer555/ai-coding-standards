Project Rules:

This project uses shared agent rules from the repository root.

Always follow:
- `core/scope.md`

Conditional rules:
- Load `core/coding.md` only when editing JS / TS / component script / business logic.
- Load `core/decision.md` when a task involves deletion, refactor, replacement, compatibility decisions, multiple valid solutions, or expanded scope.
- Load `core/review.md` before and after code changes.
- Load `domains/vue.md` for Vue3 work.
- Load `domains/uniapp.md` plus `domains/vue.md` for UniApp work.
- Load `domains/react.md` for React work.
- Load `domains/performance.md` only for explicit performance tasks.
- Load `domains/architecture.md` only for explicit architecture tasks.
- Load `domains/output.md` for final replies.

Do not copy rule text into adapter files. Update the shared files instead.
