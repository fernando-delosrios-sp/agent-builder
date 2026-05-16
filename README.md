# Agent Builder

[![skills.sh](https://skills.sh/b/fdelosriossanchez/agent-builder)](https://skills.sh/fdelosriossanchez/agent-builder)

A meta-agent for building, designing, and shipping AI agents and skills. Load this repo into any supported AI coding agent — it will interview you, design the architecture, generate instruction files, and guide you through QA and MCP configuration.

## Install the builder's skills

```bash
npx skills add fdelosriossanchez/agent-builder
```

The CLI will detect your installed AI agents (Cursor, Claude Code, Gemini CLI, Codex, etc.) and let you choose which ones to deploy to — or use `--all` to deploy to all of them.

## Initial setup

Run once to install the third-party skills the builder depends on:

```bash
# Domain-aware interview & skill authoring (mattpocock)
npx skills add mattpocock/skills --skill grill-with-docs write-a-skill --all -y

# Skill discovery (Vercel)
npx skills add vercel-labs/skills --skill find-skills --all -y

# Live documentation (Context7 / Upstash)
npx skills add upstash/context7 --skill context7-cli --all -y

# Skill creation & agent development (Anthropic)
npx skills add anthropics/skills --skill skill-creator --all -y
npx skills add anthropics/claude-code --skill agent-development --all -y
```

> **Tip:** Omit `--all -y` to run interactively and choose which agents to install each skill to.

## QA — instruction diagnostics

After any agent or skill is built, run:

```bash
npx @reporails/cli check
```

Reporails validates your instruction files (GEMINI.md, CLAUDE.md, AGENTS.md, SKILL.md) against 92+ deterministic rules and gives you an actionable score. For full cross-file diagnostics:

```bash
npx @reporails/cli auth login
```

Browse all rules at [reporails.com/rules](https://reporails.com/rules).

## MCP configuration

As a final step, the builder will help you select MCP servers for your agent's domain. Browse the catalogue:

- [mcpservers.org](https://mcpservers.org/) — all categories (Search, Database, Cloud, Dev, etc.)
- [Remote MCP Servers](https://mcpservers.org/remote-mcp-servers) — no-install, hosted MCPs

The builder outputs a ready-to-paste MCP config block for your harness.

## Deploying an agent

Agents in this repo are deployable standalone units. Use [`degit`](https://github.com/Rich-Harris/degit) to copy only the agent folder into your project — no git history, no full repo clone:

```bash
# Deploy to your project root (agent becomes the primary AI identity)
npx degit fernando-delosrios-sp/agent-builder/agents/<agent-name> . --force

# Or deploy as a sub-agent alongside an existing orchestrator
npx degit fernando-delosrios-sp/agent-builder/agents/<agent-name> agents/<agent-name> --force
```

`--force` is required when the destination directory already has files (which is always the case for an existing project).

| Agent | Description | Deploy command |
|---|---|---|
| `sailpoint-connector-perf` | Performance auditor for `@sailpoint/connector-sdk` projects | `npx degit fernando-delosrios-sp/agent-builder/agents/sailpoint-connector-perf . --force` |


Each agent folder contains its own `README.md` with usage instructions, trigger phrases, and upstream skill requirements.

## Multi-agent setup

When a project needs more than one specialist, use an **orchestrator + sub-agents** pattern:

```
<project-root>/
├── AGENTS.md        # Orchestrator core instructions + sub-agent registry
└── agents/
    ├── perf/        # npx degit .../sailpoint-connector-perf agents/perf
    │   ├── AGENTS.md
    │   └── .agents/skills/
    └── security/    # npx degit .../another-agent agents/security
        └── AGENTS.md
```

**Deploy the orchestrator:**
```bash
# Pull just the harness file you need from this repo (or write your own)
npx degit fernando-delosrios-sp/agent-builder/agents/<orchestrator> . --force
```

**Register sub-agents in `AGENTS.md`:**
```markdown
## agents/perf — SailPoint Connector Performance Auditor
Audits and refactors connector performance. Invoke when the user asks to
audit, optimize, or fix connector performance issues.

## agents/security — Security Reviewer
Reviews connector code for credential handling and data exposure issues.
```

**Rules:**
- Max two levels deep: orchestrator → sub-agent. Never orchestrator → sub-agent → sub-agent.
- Each sub-agent is self-contained: its own `AGENTS.md` and `.agents/skills/`.
- The orchestrator delegates; it does not duplicate sub-agent logic.
- Sub-agents can be activated directly (by `cd agents/perf` in some harnesses) or invoked by the orchestrator when the user's request matches their domain.

## Project structure



```
agent-builder/
├── AGENTS.md              # Generic core — rename to CLAUDE.md, GEMINI.md, etc.
├── CONTEXT.md             # Domain model: glossary, scoring rules, archetypes
├── README.md              # This file
│
├── templates/             # Template source for building agents
│   └── AGENTS.md          # Generic core — builder copies and populates
│
├── .agents/               # Builder runtime skills (auto-loaded by skills CLI)
│   └── skills/
│       ├── agent-builder/
│       └── skill-builder/
│
└── agents/                # Built agent output only — not part of building process
```

To deploy an agent, take `AGENTS.md` and rename it to your harness file (e.g., `CLAUDE.md`, `GEMINI.md`, `CURSOR.md`).

## Supported agents

`npx skills` auto-deploys to any of the 50+ supported agents. Common targets:

| Agent | `--agent` flag |
|---|---|
| Claude Code | `claude-code` |
| Cursor | `cursor` |
| Gemini CLI | `gemini-cli` |
| Codex | `codex` |
| Antigravity | `antigravity` |
| OpenCode | `opencode` |
| Windsurf | `windsurf` |

Full list at [github.com/vercel-labs/skills#supported-agents](https://github.com/vercel-labs/skills#supported-agents).
