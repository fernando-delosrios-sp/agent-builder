---
name: find-mcp
description: |
  Discover and configure MCP servers for AI agents by matching agent domains to a curated catalogue.
  Use when user needs MCP tools, asks about model context protocol servers, is configuring an agent's external integrations,
  or says 'find MCP', 'which MCP servers should I use', 'add MCP to my agent', 'configure MCP', 'select MCP servers'.
---

# Find MCP

Select and configure MCP servers for an AI agent from a curated catalogue refreshed from mcpservers.org on every `npm install`.

**Catalogue:** `skills/find-mcp/data/mcp-servers.json`
**Reference:** `[📋 Full docs](./REFERENCE.md)` — category mapping, config formats, scoring, schema.

## When to Use

- `agent-builder` passes an agent domain + target harness for MCP configuration
- User asks "what MCP servers for X" or "add MCP to my agent"
- User says "configure MCP", "find MCP servers", "select MCP"

## Step 1 — Load Catalogue

```bash
node skills/find-mcp/scripts/fetch-mcp-servers.js
```
Load `skills/find-mcp/data/mcp-servers.json`. If empty, run the fetch script first.

## Step 2 — Match by Domain

Map the agent's domain to MCP categories:

| Domain | Categories |
|---|---|
| web browsing/scraping/research | `web-scraping`, `search` |
| code/CI/CD | `development`, `version-control` |
| database/data | `database` |
| cloud/DevOps | `cloud-service` |
| messaging/email | `communication` |
| filesystem | `file-system` |

Filter catalogue to matching entries. Exclude anything in `mandatory_mcps` from the brief.

## Step 3 — Score and Rank

Score each candidate: category alignment (0–1.0) + official badge (+0.2) + description quality (+0.1) + harness compat (+0.1).

Present top 3–5 candidates:
```
[MCP Name] — [category] [official]
[description]
Harnesses: [compatible]
```

Ask user to confirm selections (default: include all).

## Step 4 — Generate Config Block

Build JSON for target harness:

**Claude Code** (`~/.claude_desktop_config.json`):
```json
{ "mcpServers": { "[name]": { "command": "npx", "args": ["-y", "[package]"] } } }
```

**Cursor** (`cursor.mcp.json` — same format, project or global):
```json
{ "mcpServers": { "[name]": { "command": "npx", "args": ["-y", "[package]"] } } }
```

**Gemini CLI** (`gemini.mcp.json` — project root):
```json
[{ "name": "[name]", "command": "npx", "args": ["-y", "[package]"] }]
```

Return: config block + which files need it + any env var notes.

## Step 5 — Append to Bundle

Append config to the agent's harness file(s). Note global config paths for Claude Code/Cursor. Skip if no relevant MCPs exist for the domain.

## Manual Entries

Users can add custom MCPs to `data/mcp-servers.json` without a `source` field — these are preserved on every re-fetch. See `[📋 Reference](./REFERENCE.md)` for schema.