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
# Grill & skill authoring (mattpocock)
npx skills add mattpocock/skills --skill grill-me write-a-skill --all -y

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

## Project structure

```
agent-builder/
├── GEMINI.md              # Gemini CLI thin init — references AGENT.md
├── CLAUDE.md              # Claude Code thin init — references AGENT.md
├── AGENT.md               # Harness-agnostic core: mandates, workflow, QA
├── CONTEXT.md             # Domain model: glossary, scoring rules, archetypes
├── README.md              # This file
│
├── skills/                # Publishable skills — deployed via npx skills add
│   └── agent-builder/
│       └── SKILL.md
│
└── .agents/               # Builder runtime skills (auto-loaded by skills CLI)
    └── skills/
        └── agent-builder -> ../../skills/agent-builder
```

Adding a new harness is a one-file operation: create a thin init (e.g., `CURSOR.md`) that sets the identity header and references `AGENT.md` and `CONTEXT.md`. No logic duplication required.

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
