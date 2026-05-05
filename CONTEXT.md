# Agent Builder — Domain Context

The Agent Builder is a meta-agent that bridges user intent and high-quality, deployable agents. It automates the research, design, implementation, and QA of specialized agents and skills.

Read this file before making any architectural decision.

## Glossary

| Term | Definition |
|---|---|
| **Grill** | A deep, recursive interview that surfaces and validates requirements until the brief is complete. |
| **Requirements Brief** | A normalized artifact capturing: Agent Name & Persona, Core Purpose & Scope, Target Harness, Coding Agent Status, Mandatory Tools/MCPs, Data & Security Constraints, Success Criteria. |
| **Skill** | A self-contained `SKILL.md` (+ optional resources) that extends an agent's capabilities. Loaded via the `skills` CLI. |
| **Harness** | The runtime environment an agent runs inside (e.g., Gemini CLI, Claude Code, Cursor, Codex, Antigravity). |
| **Buy before Make** | Discover and reuse existing skills (score > 0.8) before creating new ones. |
| **Quality Gate** | A build is "Ready" only when `npx @reporails/cli check` reports no Critical/High findings. |
| **Two-Level Architecture** | A primary agent orchestrating specialized sub-agents. Never exceed two levels. |
| **Output Bundle** | The complete set of instruction files and skills emitted for a target harness. |
| **init.js** | The canonical multi-platform bootstrap script. Installs/updates the six upstream skills required before using agent-builder or skill-builder. Run via `node init.js`. |

## Instruction File Hierarchy

| File | Role |
|---|---|
| `GEMINI.md` / `CLAUDE.md` / … | Per-harness **thin init** — identity header + references to `AGENT.md` |
| `AGENT.md` | **Harness-agnostic core** — all mandates, workflow, skill pipeline, QA |
| `CONTEXT.md` | **Domain model** — this file; glossary, structure, scoring rules |
| `AGENTS.md` | Registry of sub-agents (only present in multi-agent setups) |
| `SKILL.md` | Procedural skill with YAML frontmatter (`name`, `description`) |

Rule: root files reference sub-files; never duplicate content across levels.

## Output Bundle Structure

```
<root>/
├── init.js                    # Bootstrap — run before agent-builder / skill-builder
├── GEMINI.md / CLAUDE.md / …  # Per-harness thin init
├── AGENT.md                   # Harness-agnostic core instructions
├── AGENTS.md                  # Sub-agent registry (multi-agent only)
├── CONTEXT.md                 # This file — domain model
├── skills/                    # Publishable skills (deployed via npx skills add)
│   └── <skill-name>/
│       └── SKILL.md
└── .agents/skills/            # Runtime skills (auto-loaded by skills CLI)
```

## Skill Pipeline Scoring

| Score | Action |
|---|---|
| > 0.8 | **Buy** — reference the existing skill in the output bundle |
| 0.5–0.8 | Evaluate fit; consider adapting |
| < 0.5 | **Make** — invoke `skill-builder` with the requirements brief |

Scoring factors: verification status, reputation, safety record, semantic match quality.

## Agent Archetypes

| Archetype | Key additions |
|---|---|
| **Standard** | 3–5 mandates, core workflow, one harness init file |
| **Coding Agent** | Mandatory skills: `context7-cli`, `find-skills`, `find-docs`. Add "Coding Mandates" block. Set `coding_agent: true`. Knowledge hierarchy: Project Context → Live Docs → Specialized Skills → Trained Knowledge. |
| **Multi-Agent** | Add `AGENTS.md` registry. Each sub-agent gets its own `AGENT.md`. Never exceed two levels. |

## State Machine

```
[Grill] → [Design] → [Build] → [QA] → [MCP Config] → Ready
```

1. **Grill** — requirements gathering until brief is complete.
2. **Design** — architecture (single vs. multi-agent), skill pipeline (Buy/Make), harness selection.
3. **Build** — emit output bundle for chosen harness.
4. **QA** — `npx @reporails/cli check`; no Critical/High findings.
5. **MCP Config** — select and emit MCP server config block.
