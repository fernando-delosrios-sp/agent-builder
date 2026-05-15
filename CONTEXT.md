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
| `AGENTS.md` | **Harness-agnostic core** — all mandates, workflow, skill pipeline, QA |
| `CONTEXT.md` | **Domain model** — this file; glossary, structure, scoring rules |
| `SKILL.md` | Procedural skill with YAML frontmatter (`name`, `description`) |

Rule: root files reference sub-files; never duplicate content across levels.

## Output Bundle Structure

```
<root>/
├── agents/                   # Isolated agents directory
│   └── <agent-name>/
│       ├── SKILL.md          # Entry point for npx skills
│       ├── AGENT.md          # Agent mandates (Source of Truth)
│       └── ...
├── skills/                   # Discoverable skills (npx skills add)
│   ├── <standalone-skill>/   # Standard standalone skill
│   ├── <agent-name>/         # Symlink to ../agents/<agent-name>/
│   └── <agent--skill>/       # Symlink to ../agents/<name>/skills/<skill>
├── .agents/skills/           # Builder runtime skills (internal)
└── init.js                   # Bootstrap script
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
| **Multi-Agent** | Add `AGENTS.md` (human) and `agents.json` (machine) registry. Each sub-agent gets its own `AGENT.md`. Never exceed two levels. |

## Registry Format (Multi-Agent)

To ensure sub-agents are discoverable by both humans and machines, every orchestrator must maintain:

1. **`AGENTS.md`**: A markdown routing table describing each sub-agent's domain.
2. **`agents.json`**: A machine-readable array of sub-agent metadata:
   ```json
   [
     {
       "name": "specialist-name",
       "path": "agents/specialist-name",
       "domain": ["list", "of", "capabilities"],
       "trigger": "regex or description of when to delegate"
     }
   ]
   ```

## State Machine

```
[Grill] → [Design] → [Build] → [QA] → [MCP Config] → Ready
```

1. **Grill** — requirements gathering until brief is complete.
2. **Design** — architecture (single vs. multi-agent), skill pipeline (Buy/Make), harness selection.
3. **Build** — emit output bundle for chosen harness.
4. **QA** — `npx @reporails/cli check`; no Critical/High findings.
5. **MCP Config** — select and emit MCP server config block.
