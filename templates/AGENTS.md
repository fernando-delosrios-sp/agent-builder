# AGENTS.md
> This is the template source. The output file MUST be named `AGENTS.md` (plural, never `AGENT.md`).
> The user renames it to their harness file (CLAUDE.md, GEMINI.md, etc.) at deployment.

```markdown
# Before anything else
Before starting any work, read `.agents/PROGRESS.md` and the last 3 git commits.

# Project identity
Read from `.agents/IDENTITY.md`

# Documentation
Don't guess — read the relevant doc before making changes.
- Project context and domain terminology → `.agents/CONTEXT.md` (maintained via `grill-with-docs`; see rules below)
- Architecture decisions → `docs/adr/`
- Engineering rules and code standards → `.agents/RULES.md`
- Coding mindset and philosophy → `.agents/MINDSET.md`

# Journal
Before starting, read `.agents/JOURNAL.md` (create if missing if empty).
- Only record CRITICAL architecture and build learnings. Not a log.
- See `.agents/JOURNAL.md` for rules on what to record and the entry format.

# Session protocol
1. Read `.agents/PROGRESS.md` and the last 3 git commits before starting.
2. Prioritize the user's instructions. Only default to the "What's next" section in `.agents/PROGRESS.md` when the user provides no specific direction.
3. Update `.agents/PROGRESS.md` at the end of every session.
4. Commit with a clear, descriptive message.

# Key constraints
- Never add third-party packages or dependencies.
- Never modify the project structure without checking `docs/adr/` first.
- Never skip the `.agents/PROGRESS.md` update at end of session.
- Always run the app and verify changes work before committing.
- After completing any feature, scan for rule violations in files you touched and fix them before committing.
- When new domain terms are resolved, update `.agents/CONTEXT.md` inline using `grill-with-docs` methodology (challenge against glossary, sharpen fuzzy language, capture decisions immediately).
```