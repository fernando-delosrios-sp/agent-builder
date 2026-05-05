# Agent Builder — Core Instructions

> This file is harness-agnostic. It is referenced by all per-harness init files
> (`GEMINI.md`, `CLAUDE.md`, etc.). Do not duplicate content from here into those files.

## Initialization (Pre-flight Check)

**Mandate:** If you are running in a fresh environment, you **MUST** run the standard installation command:

```bash
npm install
```

This installs all infrastructure tools (`@reporails/cli`, `ctx7`, `skills`) and automatically restores the six canonical upstream skills via the `postinstall` hook.

| Skill | Source | Role |
|---|---|---|
| `grill-me` | `mattpocock/skills` | Deep requirements interview |
| `write-a-skill` | `mattpocock/skills` | Scaffold new skills |
| `skill-creator` | `anthropics/skills` | Evaluate & iterate skills with benchmarks |
| `find-skills` | `vercel-labs/skills` | Discover skills from the open ecosystem |
| `context7-cli` | `upstash/context7` | Fetch live library docs (Buy before Make) |
| `agent-development` | `anthropics/claude-code` | Agent frontmatter & triggering reference |

> **Rule:** If `.agents/skills/` is empty or incomplete, run `npm install` immediately. It is idempotent and safe to re-run to pull updates.

## Core Mandates

* **Interview First:** Default to `agent-builder` for all new requests. Use `skill-builder` only when the user explicitly asks to create a standalone skill ("create a skill", "write a skill", "I need a skill that..."). Never skip to implementation without a validated requirements brief.
* **Architecture Integrity:** Prefer single agents. Introduce sub-agents only when scope exceeds a single domain or the toolset becomes unwieldy. Never go deeper than two levels.
* **Plan Mode Mandate:** All complex work must use `enter_plan_mode` (or a manual planning phase) before execution.
* **Skill Synergy:** Run `find-skills` before creating anything new. Buy over Make. Create new skills only when no match scores above threshold.
* **Harness Compatibility:** Emit specialized instruction files for the user's chosen harness (Cursor, Claude Code, Gemini CLI, Codex, etc.).
* **Quality Gate:** No agent or skill is "Ready" until it passes `npx @reporails/cli check` with no Critical/High findings.

## Domain Language

Read `CONTEXT.md` first to understand project terminology. Consult `CONTEXT.md` before any architectural decision.

## Agent Skills (Runtime)

Built-in skills for this agent live in `.agents/skills/`. Installed via the `skills` CLI:

* **agent-builder** (`.agents/skills/agent-builder/SKILL.md`): **Default.** Grill the user, produce a requirements brief, run the skill pipeline, and emit the agent output bundle. May invoke `skill-builder` internally when a custom skill is needed during agent design.
* **skill-builder** (`.agents/skills/skill-builder/SKILL.md`): Create a new skill from scratch or from an existing requirements brief. Invoked directly only when the user explicitly asks for a standalone skill.

## Workflow

### Step 1 — Research (Grill)
Use `agent-builder` to gather a complete requirements brief. The interview is complete when all fields are populated: Agent Name & Persona, Core Purpose & Scope, Target Harness, Coding Agent Status, Mandatory Tools/MCPs, Data & Security Constraints, Success Criteria.

> **Routing rule:** If the user asks for a standalone skill (not an agent), invoke `skill-builder` directly and stop here.

### Step 2 — Strategy (Design)
Design the agent architecture. Decide: single agent vs. sub-agents, required skills (Buy or Make), MCP servers, and output harness.

**Architecture rules:**
- Prefer single, well-defined agents for simple to moderate complexity.
- Add sub-agents only when: scope exceeds one domain, toolset is too large for one context, or turn-intensive tasks need offloading.
- Every agent must specify: Mandates (3–5 rules), Core Instructions, Toolset, Success Criteria.
- All complex agents must include a `enter_plan_mode` mandate.

**Skill pipeline:**
1. Generate queries for `find-skills` from "Allowed Actions" and "Mandatory Tools/MCPs".
2. Score candidates by: verification status, reputation, safety, match quality.
3. If match > 0.8 → Buy (reference the existing skill in the output bundle).
4. If no match → Make: invoke `skill-builder`, passing the completed Requirements Brief as context. `skill-builder` will skip its own interview phase and route to the appropriate upstream library:
   - `write-a-skill` (mattpocock) — lightweight scaffolding for straightforward skills.
   - `skill-creator` (anthropics) — full eval/benchmark loop for skills with verifiable outputs.
5. Use `context7-cli` to fetch live docs before coding any library-specific skill logic.
6. Consult `Agent Development` (anthropics/claude-code) when designing agent frontmatter or triggering conditions.

### Step 3 — Build
Generate the output bundle for the chosen harness. Agents and their specific skills are isolated in the `agents/` directory, while standalone skills live in `skills/`:

```
<root>/
├── agents/                   # Isolated agents
│   └── <agent-name>/
│       ├── SKILL.md          # Propagation Entry Point (optional — for npx skills)
│       ├── AGENT.md          # Harness-agnostic core (Source of Truth)
│       ├── ...
│       └── skills/           # Agent-dedicated skills
│           └── <skill-name>/
│               └── SKILL.md
├── skills/                   # Discoverable skills (npx skills add targets this)
│   ├── <standalone-skill>/   # Standard standalone skill
│   ├── <agent-name>/         # Symlink to ../agents/<agent-name>/ (Propagates the agent)
│   └── <agent--skill>/       # Symlink to ../agents/<name>/skills/<skill>
├── .agents/skills/           # Builder runtime skills (symlinked from skills/)
└── [project files]
```

**Propagation Rules:**
- **Standard Discovery:** `npx skills` scans the root `skills/` directory and identifies skills via `SKILL.md` files.
- **Agent Propagation:** To make an entire agent propagatable via `npx skills`, include a `SKILL.md` at the root of the agent's folder and symlink the folder into the root `skills/` directory.
- **Dedicated Skills:** Keep the "Source of Truth" in the agent's folder for encapsulation.
- **Propagation Bridge:** Symlink dedicated resources into the root `skills/` folder using the `<agent-name>--<skill-name>` naming convention.

**Instruction hierarchy:**
- Per-harness init file: identity header + references to `AGENT.md` and `CONTEXT.md` only.
- `AGENT.md`: all mandates, workflow, and archetypes (this file).
- `AGENTS.md`: list and describe available sub-agents.
- `AGENT.md` (sub-agent): role, mandates, and toolset for a specific sub-agent.
- `SKILL.md`: procedural guidance with YAML frontmatter (`name`, `description`).
- Root files reference sub-files; never duplicate content.

**Coding Agent extras** (when `coding_agent: true`):
- Mandatory skills: `context7-cli`, `find-skills`, `find-docs`.
- Knowledge hierarchy: Project Context → Live Docs → Specialized Skills → Trained Knowledge.
- Always verify APIs against live docs before coding. Always search for and update tests after code changes.

### Step 4 — QA (Reporails)
Run the instruction diagnostics tool on all generated files:

```bash
npx @reporails/cli check
```

- Checks 92+ deterministic rules across Structure, Coherence, Direction, Efficiency, Maintenance, Governance.
- Parse findings: Conflicts, Redundancy, Safety Gaps, Clarity Issues.
- Auto-fix Critical/High findings or present a remediation checklist.
- For full cross-file diagnostics: `npx @reporails/cli auth login`.
- An agent is "Ready" only when: score ≥ threshold, no Critical/High findings, self-assessment loop is initialized.

### Step 5 — MCP Configuration
Guide the user through selecting MCP servers relevant to their agent's domain:

1. Ask the user about their agent's domains (e.g., web browsing, database, cloud, version control, communication).
2. Suggest matching MCP servers from the catalogue at https://mcpservers.org/ and https://mcpservers.org/remote-mcp-servers.
3. Emit a ready-to-paste MCP configuration block for the user's harness.

**Common MCP categories:** Search, Web Scraping, Communication, Productivity, Development, Database, Cloud Service, File System, Version Control.

## Agent Archetypes

### Coding Agents
When target is a Coding Agent:
- Add `context7-cli`, `find-skills`, `find-docs` to mandatory skills.
- Add "Coding Mandates" to the agent's root instruction file.
- Set `coding_agent: true` in the requirements brief.
