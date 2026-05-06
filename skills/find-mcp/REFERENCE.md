# Find MCP — Reference

Detailed documentation for the `find-mcp` skill.

## Category Mapping — Agent Domain → MCP Category

| Agent Domain | MCP Category |
|---|---|
| web browsing, scraping, research | `web-scraping`, `search` |
| code, development, CI/CD | `development`, `version-control` |
| database, data, analytics | `database` |
| cloud, infrastructure, DevOps | `cloud-service` |
| communication, messaging, email | `communication` |
| file operations, filesystem | `file-system` |
| storage, backup | `cloud-storage` |
| productivity, automation | `productivity` |

## MCP Server Data Schema

```json
{
  "id": "github-mcp",
  "name": "GitHub",
  "description": "Interact with GitHub repositories, issues, PRs, and workflows",
  "category": "version-control",
  "official": true,
  "url": "https://mcpservers.org/servers/github/github-mcp-server",
  "installs": "high",
  "harnesses": ["claude_code", "cursor", "gemini"],
  "config": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"]
  }
}
```

**Fields:**
- `id` — unique identifier (URL slug or kebab-case name)
- `name` — display name
- `description` — what the MCP does (used for scoring)
- `category` — one of: `search`, `web-scraping`, `communication`, `productivity`, `development`, `database`, `cloud-service`, `file-system`, `cloud-storage`, `version-control`, `other`
- `official` — true if featured/official on mcpservers.org
- `url` — direct link to the MCP server page
- `installs` — `high`, `medium`, `low` (heuristic from name/reputation)
- `harnesses` — which harnesses support this MCP
- `config` — the command/args to pass to the harness
- `source` — `"auto"` for fetched entries, absent for manual entries

## Config Block Formats by Harness

### Claude Code (`~/.claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "github-mcp": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "exa-mcp": {
      "command": "npx",
      "args": ["-y", "@exa-labs/exa-mcp"]
    }
  }
}
```

Merge into existing config — do not overwrite if the file already has other MCP servers.

### Cursor (`cursor.mcp.json`)

Same format as Claude Code. Place in project root or global settings:
- macOS: `~/.cursor/settings/mcp.json`
- Windows: `C:\Users\<you>\.cursor\settings\mcp.json`

### Gemini CLI (`gemini.mcp.json`)

```json
[
  {
    "name": "github-mcp",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"]
  },
  {
    "name": "exa-mcp",
    "command": "npx",
    "args": ["-y", "@exa-labs/exa-mcp"]
  }
]
```

Place in the project root alongside the agent bundle.

## Scoring Algorithm

Each candidate MCP gets a score from 0–1.5:

| Factor | Weight | Condition |
|---|---|---|
| Category alignment | 0.0–1.0 | Exact match = 1.0, partial = 0.6 |
| Official badge | +0.2 | `official: true` |
| Description quality | +0.1 | description.length > 50 |
| Harness compatibility | +0.1 | target harness in `harnesses` array |

Threshold for recommendation: score > 0.5.

## Fetch Script

`scripts/fetch-mcp-servers.js` populates the catalogue:

```bash
node skills/find-mcp/scripts/fetch-mcp-servers.js
```

It runs automatically during `npm install` via init.js Step 3.

**What it does:**
1. Fetches https://mcpservers.org/ (featured servers)
2. Fetches each category page (11 categories)
3. Extracts: name, description, URL, slug
4. Detects category and package name from URL/name
5. Merges with existing data (preserves manual entries)
6. Writes to `data/mcp-servers.json`

**Merge logic:**
- Entries with `source: "auto"` are overwritten on every fetch
- Entries without `source` (manual) are preserved
- If an auto-fetched entry has the same `id` as a manual entry, the manual one wins

## Adding Manual Entries

Add entries directly to `data/mcp-servers.json` without a `source` field:

```json
{
  "id": "my-company-mcp",
  "name": "My Company API",
  "description": "Internal API for MyCompany data and operations",
  "category": "cloud-service",
  "official": false,
  "harnesses": ["claude_code", "cursor", "gemini"],
  "config": {
    "command": "node",
    "args": ["/Users/you/my-company-mcp/dist/index.js"]
  }
}
```