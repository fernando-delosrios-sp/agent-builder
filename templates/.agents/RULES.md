# RULES.md
# Engineering & Coding Rules

---

## **If you are an AI coding agent, you must follow these instructions exactly**

- **Never experiment or improvise.**
- **Always clarify before acting if unsure.**
- **Do not break or degrade any existing feature, UX, or code structure.**
- **Always follow SLC (Simple, Lovable, Complete) mindset.**

---

## Overview

These rules govern how AI agents write, review, and refactor code for this project. They are derived from general engineering best practices and behavioral guidelines to reduce common LLM coding mistakes.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

---

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

---

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### SLC Design Principles

- **Simple:** No bloat, no redundant features, no over-engineering.
- **Lovable:** Delightful details (animation, feedback, micro-interactions).
- **Complete:** Each feature is robust, accessible, and feels finished (no rough edges).

---

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

**The test:** Every changed line should trace directly to the user's request.

---

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## 5. General Engineering Guidelines

- **Code Splitting:** When a file exceeds ~200 lines or becomes unwieldy, refactor it into smaller, more modular files. When a function exceeds ~30 lines or does more than one thing, split it into smaller, purpose-driven functions.
- **Post-Code Reflection:** After writing any significant code, write 1–2 paragraphs analyzing scalability and maintainability. If applicable, recommend next steps or technical improvements.
- **Dependencies:** Ask before adding 3rd-party libraries. Prefer native, built-in solutions over external dependencies.
- **Build Integration:** All new files must be added to the project build system to compile correctly.

### Backend & API

- **Validate at the boundary:** Never trust client input. Sanitize and validate before storage or processing.
- **Fail securely:** Return generic error messages to clients; log specifics internally. Never expose stack traces or internal paths in production.
- **No hardcoded secrets:** Use environment variables and secrets managers. Never commit credentials or API keys.
- **Consistent contracts:** Use predictable endpoint naming, stable error response shapes, and clear HTTP status codes.
- **Idempotency:** Safe mutations should be retry-friendly. Prefer upserts and deduplication over fragile sequences.
- **Pagination for lists:** All item-listing APIs must implement pagination. Avoid unbounded result sets; default to reasonable page sizes and return total counts and next-page tokens.

---

## 6. Your Role & Engineering Ethos

- Build for maintainability, clarity, and explicitness.
- Simplicity and reliability over cleverness.
- Think "production code" at all times, even for quick tasks.
- Respect existing code and patterns — **audit before adding new code**.
- Follow platform conventions and interface guidelines for your target platform.

---

## 7. Accessibility & Device Support

- All screens and features must support assistive technologies, dynamic sizing, color contrast, and reduced motion preferences.
- Test on multiple screen sizes and input methods.
- Use responsive layouts and native controls to adapt UI as needed.
- **No custom accessibility implementations** unless absolutely required (prefer built-in behaviors).

---

## 8. Explicit "DO NOT" List

- **Do NOT add 3rd-party UI or analytics libraries without approval.**
- **Do NOT break code into "clever" new patterns (stick to the existing architecture).**
- **Do NOT add experimental or "in-progress" features to main.**
- **Do NOT remove or downgrade existing accessibility features.**
- **Do NOT add new build targets, environments, or major structure without approval.**
- **Do NOT "hide" complexity — be explicit and readable.**
- **Do NOT duplicate business logic — centralize in Managers/Services.**
- **Do NOT move/rename folders without team lead approval.**
- **Do NOT hardcode secrets, API keys, or environment-specific configuration.**
