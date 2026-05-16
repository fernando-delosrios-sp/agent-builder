---
name: agent-builder
description: |
  Interview the user using `grill-with-docs` methodology to gather and validate requirements for a new AI agent,
  then drive architecture, skill selection, MCP configuration, and harness output.
  Use when user asks to build, design, or spec an agent ("build me an agent", "I need an agent that...", "design an agent for...").
  For standalone skill creation without an agent, use skill-builder instead.
---

# Skill: Agent Builder

Transforms a vague user request into a fully specified agent: requirements brief → architecture → output bundle.

## Objective

Produce a validated requirements brief that drives architecture decisions, skill selection, MCP configuration, and harness-compatible output generation.

The interview uses the `grill-with-docs` methodology: challenge the user's plan against the existing domain model, sharpen terminology, and update documentation (CONTEXT.md, ADRs) inline as decisions crystallise.

## Step 1 — Discover (Requirements)

### Pre-flight: Domain Awareness

Before starting the interview, load the project's domain model:

1. Read `CONTEXT.md` from the project root. If a `CONTEXT-MAP.md` exists, consult it to find the correct context file.
2. Read `docs/adr/` for any existing architectural decisions that constrain the agent design.

This ensures every question is grounded in the project's existing language and decisions.

### Interview Protocol

**CRITICAL RULE — ONE QUESTION PER TURN:**
Ask **exactly one question** per response. Wait for the user's answer before asking the next one. Never batch questions. If a topic has an obvious default, propose it as a recommendation and ask the user to confirm or override — that counts as your one question for the turn.

Work through the Design Tree in order, one item at a time:
1. **Outcome First** — what does the agent accomplish? Define success criteria before decomposing into tasks.
2. **Scope & Persona** — what is the agent's role and boundaries?
3. **Runtime Context** — where does it run? (local CLI, CI/CD, cloud, IDE harness)
4. **Coding Agent?** — explicitly classify: does it need library/framework knowledge, linting, or test execution?
5. **Data Boundaries** — what can it access? What is off-limits?
6. **External Systems** — APIs, databases, tools, MCPs it interacts with.
7. **Allowed Actions** — read-only vs. write-capable vs. shell execution.
8. **Latency/Cost** — performance and budget constraints.

Do not move to the next item until the current one is resolved or the user explicitly defers it. When in doubt, propose a sensible recommendation and ask for confirmation.

### Domain Challenge Rules

Throughout the interview, apply these `grill-with-docs` disciplines:

- **Challenge against the glossary:** When the user uses a term that conflicts with the existing language in `CONTEXT.md`, call it out immediately. "Your glossary defines 'X' as Y, but you seem to mean Z — which is it?"
- **Sharpen fuzzy language:** When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account' — do you mean the Customer or the User? Those are different things."
- **Discuss concrete scenarios:** Stress-test domain relationships with specific scenarios that probe edge cases and force precision about boundaries between concepts.
- **Cross-reference with code:** When the user states how something works, check whether the code agrees. If there's a contradiction, surface it.

### Documentation Updates

Update documentation inline as decisions are made:

- **Update CONTEXT.md** when a new term or domain concept is resolved. Do not batch — capture as they happen.
- **Offer an ADR** only when all three are true:
  1. Hard to reverse — the cost of changing your mind later is meaningful.
  2. Surprising without context — a future reader will wonder "why did they do it this way?"
  3. The result of a real trade-off with genuine alternatives.
  If any is missing, skip the ADR.

### Completeness Threshold

Interview is complete when all fields are populated:

- [ ] Agent Name & Persona
- [ ] Core Purpose & Scope
- [ ] Target Harness (e.g., Cursor, Claude Code, Gemini CLI)
- [ ] Explicit Coding Agent Status (Yes/No)
- [ ] Mandatory Tools/MCPs (if known)
- [ ] Data & Security Constraints
- [ ] Success Criteria for the built agent

**Output:** A markdown-formatted Requirements Brief containing the above fields.

## Step 2 — Skill Pipeline

After the brief is complete, run the skill pipeline:

1. Generate search queries from "Allowed Actions" and "Mandatory Tools/MCPs" in the brief.
2. Run `find-skills` for each query. Score candidates: verification status, reputation, safety, match quality.
3. **If match > 0.8** → Buy (reference the existing skill in the output bundle).
4. **If no match** → Make: invoke `skill-builder`, passing the Requirements Brief as context. Explicitly instruct `skill-builder` to target the `agents/<agent-name>/skills/` directory for the new skill.

## Step 3 — Architecture & Build

Design the agent architecture and emit the output bundle for the target harness.

**Template Foundation:**
The output bundle starts from the template at `agents/agent-builder/`. Copy the template files into `agents/<agent-name>/` as the foundation, then populate from the brief:

- `.agents/IDENTITY.md` — filled with agent identity details from the Requirements Brief.
- `.agents/CONTEXT.md` — populated with domain terms resolved during the Grill (Step 1). The resulting agent MUST maintain this file via `grill-with-docs` (challenge against glossary, sharpen fuzzy language, update inline).
- `AGENTS.md` — updated with agent-specific mandates, session protocol, and constraints. Must include a mandate that `.agents/CONTEXT.md` is maintained via `grill-with-docs`.

The template's `.agents/JOURNAL.md`, `.agents/MINDSET.md`, `.agents/PROGRESS.md`, and `.agents/RULES.md` are carried through as-is into the output bundle.

**Mandatory Bundle Contents (beyond the template):**
1. **Target Harness File** (e.g., `GEMINI.md`, `CLAUDE.md`) — thin init referencing `AGENTS.md`.
2. **Google Jules Companion** (`.jules/<agent-name>.md`) — following the persona-driven pattern in `AGENTS.md`.
3. **README.md** with `degit` deployment command.

**Path Rules:**
- The agent bundle goes into `agents/<agent-name>/`.
- Skills specifically created for this agent go into `agents/<agent-name>/.agents/skills/`.
- Reused/Standalone skills go into `skills/`.

See `AGENTS.md` Step 3 for the full architecture rules and file layout.

## Step 4 — QA

**This is an iterative feedback loop, not a one-pass gate.** QA findings are symptoms of root-cause gaps in the requirements brief or architecture. Do not simply "auto-fix" — trace each finding back to its source.

**Before running QA**, read `.agents/skills/agent-development/SKILL.md` to verify that all agent frontmatter and triggering conditions in the generated bundle conform to the canonical patterns documented there.

Then run the diagnostics tool on all generated instruction files:

```bash
npx @reporails/cli check
```

Parse the output:
- **Critical/High findings** → diagnose the root cause in the requirements brief or design. Loop back to Step 1 (Grill): challenge the assumptions that produced the gaps, sharpen the brief, update CONTEXT.md/ADRs inline, then re-Design and re-Build. Repeat QA until zero Critical/High findings remain.
- **Medium/Low findings** → surface them for awareness but they do not block the loop.

An agent is **Ready** only when: no Critical/High findings remain and frontmatter has been validated against `agent-development` patterns.
