---
name: agent-builder
description: |
  Interview the user to gather and validate requirements for a new AI agent, then drive
  architecture, skill selection, MCP configuration, and harness output.
  Use when user asks to build, design, or spec an agent ("build me an agent", "I need an agent that...", "design an agent for...").
  For standalone skill creation without an agent, use skill-builder instead.
---

# Skill: Agent Builder

Transforms a vague user request into a fully specified agent: requirements brief → architecture → output bundle.

## Objective

Produce a validated requirements brief that drives architecture decisions, skill selection, MCP configuration, and harness-compatible output generation.

## Step 1 — Grill (Requirements)

Interview the user until all fields in the Completeness Threshold are resolved. Do not move to the next topic until the current one is settled or explicitly deferred.

**Walk the Design Tree:**
1. **Outcome First** — what does the agent accomplish? Define success criteria before decomposing into tasks.
2. **Scope & Persona** — what is the agent's role and boundaries?
3. **Runtime Context** — where does it run? (local CLI, CI/CD, cloud, IDE harness)
4. **Coding Agent?** — explicitly classify: does it need library/framework knowledge, linting, or test execution?
5. **Data Boundaries** — what can it access? What is off-limits?
6. **External Systems** — APIs, databases, tools, MCPs it interacts with.
7. **Allowed Actions** — read-only vs. write-capable vs. shell execution.
8. **Latency/Cost** — performance and budget constraints.

**Propose recommendations** for standard/obvious choices rather than asking open-ended questions.

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
4. **If no match** → Make: invoke `skill-builder`, passing the Requirements Brief as context. `skill-builder` will skip its own interview phase since the brief is already complete.

## Step 3 — Architecture & Build

Design the agent architecture and emit the output bundle for the target harness. See `GEMINI.md` Step 2–3 for the full architecture rules and file layout.

## Step 4 — QA

Run `npx @reporails/cli check` on all generated instruction files. An agent is Ready only when no Critical/High findings remain.
