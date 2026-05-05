---
name: skill-builder
description: |
  Create a new agent skill from scratch or from an existing requirements brief.
  Use when user asks to "create a skill", "build a skill", "write a skill", or "I need a skill that...".
  Also invoked internally by agent-builder when an agent requires a specialised custom skill.
  If a requirements brief is provided, skip the interview phase and proceed directly to drafting.
---

# Skill: Skill Builder

Creates well-structured, tested, and publishable agent skills. Can be invoked standalone or from within `agent-builder` when a custom skill is required during agent design.

## Entry Point Decision

**Check for a pre-existing Requirements Brief before doing anything:**

- **Brief provided** (called from `agent-builder` or user pastes context) → skip to [Step 2 — Draft](#step-2--draft). Extract domain, use cases, trigger contexts, and output format directly from the brief. Do not re-interview.
- **No brief** → run [Step 1 — Capture Intent](#step-1--capture-intent) first.

---

## Step 1 — Capture Intent (standalone only)

Ask only what is needed to write a good skill. Do not over-interview.

1. What should this skill enable the agent to do?
2. When should it trigger? (specific user phrases, file types, contexts)
3. What is the expected output format?
4. Does it need deterministic scripts, or is instruction-only sufficient?
5. Any reference materials or examples to include?

Stop when you have enough to write a confident first draft.

---

## Step 2 — Draft

Write the skill using the standard structure.

**Path Rules:**
- **Standalone calls:** The skill directory goes into `./skills/`.
- **Internal calls (from agent-builder):** The skill directory goes into `./agents/<agent-name>/skills/`.

```
<skill-name>/
├── SKILL.md          # Required. YAML frontmatter + instructions. Keep under 100 lines.
├── REFERENCE.md      # Optional. Detailed docs if SKILL.md would exceed 100 lines.
├── EXAMPLES.md       # Optional. Concrete usage examples.
└── scripts/          # Optional. Deterministic helper scripts.
```

**SKILL.md frontmatter:**
```yaml
---
name: skill-name
description: |
  One sentence: what it does.
  Second sentence: "Use when [specific triggers]." Max 1024 chars.
---
```

**Description rules** (the description is the only thing the agent sees when deciding to load the skill):
- Third person, max 1024 chars
- First sentence: capability. Second sentence: triggers with "Use when..."
- Be specific about trigger contexts — err on the side of being slightly pushy so the agent doesn't undertrigger
- Bad: "Helps with documents." Good: "Extracts text and tables from PDF files. Use when user mentions PDFs, forms, or document extraction."

**Body rules:**
- Lead with a Quick Start (minimal working example)
- Use imperative form in instructions
- Explain *why* things matter, not just *what* to do — LLMs follow reasoning better than rigid MUSTs
- If content exceeds 100 lines, split into REFERENCE.md and link from SKILL.md
- Add scripts/ only for deterministic, repeatable operations (saves tokens on every invocation)

---

## Step 3 — Route to Library

After drafting, choose the appropriate third-party library based on fidelity required:

**Use `write-a-skill` (mattpocock) when:**
- The skill is simple and well-defined
- Quick iteration is more important than rigorous evals
- Harness is not Claude Code (library degrades gracefully)
- This is an early draft

**Use `skill-creator` (anthropics) when:**
- The skill has complex trigger logic needing description optimization
- The skill will be published to `skills.sh` or used at scale
- You are improving an existing skill (its eval comparison is designed for this)
- Subagents are available (Claude Code / Cowork)

**Brief handoff to library:** When delegating to either library, prepend the context:
> "A requirements brief already exists. Skip intent-capture. Domain: [X]. Use cases: [Y]. Trigger contexts: [Z]."

---

## Step 4 — Review Checklist

Before finalizing:

- [ ] Description includes specific triggers ("Use when...")
- [ ] SKILL.md under 100 lines
- [ ] No time-sensitive information
- [ ] Consistent terminology throughout
- [ ] At least one concrete example
- [ ] References are one level deep (no nested includes)
- [ ] Scripts added only for deterministic operations

---

## Step 5 — QA (if publishing)

For skills destined for `skills/` (publishable), run description optimization via `skill-creator`'s description optimization loop to maximize triggering accuracy before publishing.
