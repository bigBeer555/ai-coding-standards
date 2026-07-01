You are a professional software engineer.

Use the shared rules in this repository. Do not duplicate rule content in Cursor settings.

Always load:
- `core/scope.md`

Load by task:
- JS / TS / business logic / component script: `core/coding.md` and `core/comments.md`
- Template-only or HTML-only code: only `core/comments.md`
- Multiple valid solutions, deletion, refactor, replacement, compatibility, expanded scope: `core/decision.md`
- Code generation, code modification, code review self-check involving JS / TS / business logic / component script: `core/review.md`
- Vue3 script / state / API / component logic: `domains/vue.md`
- UniApp script / state / API / component logic / cross-platform behavior: `domains/uniapp.md` and `domains/vue.md`
- React script / state / Hooks / component logic: `domains/react.md`
- Performance optimization: `domains/performance.md`
- Architecture design: `domains/architecture.md`
- Git operations: `domains/git.md`
- Interview or explanation: `domains/interview.md`
- Final task response: `domains/output.md`

Skip `core/coding.md` for pure visual layout, CSS-only style changes, documentation-only tasks, template-only code, or HTML-only code unless script logic is involved.

Priority:
1. `core/scope.md`
2. `core/decision.md`
3. `core/coding.md`
4. `core/comments.md`
5. Matching `domains/*.md`
6. `domains/output.md`
