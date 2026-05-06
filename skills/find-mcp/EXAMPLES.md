# Find MCP — Usage Examples

## Example 1: Agent Builder invoking find-mcp

**Context from agent-builder:**
- Agent domain: "web research and data extraction"
- Target harness: `claude_code`
- Mandatory MCPs: none

**Skill workflow:**
1. Loads catalogue → filters by `web-scraping` + `search`
2. Ranks candidates: Exa (search, official), Firecrawl (web-scraping, official), Browserbase (browser automation, official)
3. Presents top 3 to user for confirmation
4. User confirms all three
5. Generates Claude Code config block
6. Returns block + note about global config path

**Output config block:**
```json
{
  "mcpServers": {
    "exa-mcp": {
      "command": "npx",
      "args": ["-y", "@exa-labs/exa-mcp"]
    },
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "@github-com-firecrawl-firecrawl-mcp-server"]
    },
    "browserbase": {
      "command": "npx",
      "args": ["-y", "@browserbase/mcp-server-browserbase"]
    }
  }
}
```

---

## Example 2: User asks directly

**User:** "I need MCP servers for a database monitoring agent"

**Skill response:**
1. Infers categories: `database`, `cloud-service`
2. Loads catalogue → filters by those categories
3. Presents Supabase, Neon, PlanetScale options
4. User confirms Supabase
5. Generates Cursor config block
6. Notes: "Remember to set `DATABASE_URL` env var for the Supabase MCP"

---

## Example 3: Agent already has mandatory MCPs

**Context:**
- Mandatory MCPs: `["github-mcp"]` (user already specified)
- Target harness: `gemini`

**Skill workflow:**
1. Loads catalogue → filters by domain (e.g., `development`)
2. Excludes `github-mcp` from recommendations (already mandatory)
3. Presents remaining candidates
4. User confirms Playwright
5. Generates Gemini CLI config block (array format)

---

## Example 4: No matches found

If the catalogue has no entries for the agent's domain:

```
No MCP servers found for category "finance". You can:
1. Manually add an MCP to skills/find-mcp/data/mcp-servers.json
2. Check mcpservers.org for options and add them manually
3. Use a universal MCP like "Filesystem" or "HTTP Tools" as a fallback
```

---

## Harness Config Paths

| Harness | Config Location | Format |
|---|---|---|
| Claude Code | `~/.claude_desktop_config.json` | JSON object with `mcpServers` key |
| Cursor | `~/.cursor/settings/mcp.json` or project `cursor.mcp.json` | JSON object with `mcpServers` key |
| Gemini CLI | `./gemini.mcp.json` (project root) | JSON array of MCP server objects |

For Claude Code and Cursor, always note the global config path. Users need to merge into their existing config if they already have MCP servers configured.