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

## Step 1 — Discover (Requirements)

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

**Path Rules:**
- The agent bundle goes into `agents/<agent-name>/`.
- Skills specifically created for this agent go into `agents/<agent-name>/skills/`.
- Reused/Standalone skills go into `skills/`.

See `AGENT.md` Step 3 for the full architecture rules and file layout.

## Step 4 — QA

**Before running QA**, read `.agents/skills/agent-development/SKILL.md` to verify that all agent frontmatter and triggering conditions in the generated bundle conform to the canonical patterns documented there.

Then run the diagnostics tool on all generated instruction files:

```bash
npx @reporails/cli check
```

Parse the output:
- **Critical/High findings** → auto-fix or present a numbered remediation checklist to the user.
- **Medium/Low findings** → surface them but do not block.

An agent is **Ready** only when: no Critical/High findings remain and frontmatter has been validated against `agent-development` patterns.

## Step 5 — MCP Configuration

After QA is clean, invoke `find-mcp` to select and configure MCP servers for the agent:

1. Extract the agent's domain and "External Systems" from the requirements brief.
2. Pass domain + target harness to `find-mcp`.
3. Present ranked MCP candidates to the user for confirmation.
4. Generate the confirmed MCP configuration block for the target harness.
5. Append the config block to the agent bundle's harness file(s) and note any global config paths.

**Output:** A ready-to-paste MCP configuration snippet for the target harness, appended to the bundle.

> If no MCPs are relevant to the agent's domain, skip this step and mark the agent Ready.
