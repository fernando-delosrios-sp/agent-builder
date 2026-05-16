# VPS Sysadmin — Multi-Agent Orchestrator

Self-contained VPS system administration agent suite for managing a Debian VPS with Docker, Portainer, Caddy, DNS, and Homepage dashboard.

## Deploy

```bash
npx degit <github-user>/agent-builder/agents/vps-sysadmin . --force
npm install
```

## Harness Setup

After deployment, rename `AGENTS.md` to your harness file:

| Harness | Rename to |
|---|---|
| Claude Code | `CLAUDE.md` |
| Gemini CLI | `GEMINI.md` |
| OpenCode | `OPECODE.md` |
| Cursor | `.cursorrules` |

## Prerequisites

- Portainer running on the VPS (configure MCP tools in your harness)
- Caddy Docker container with config at `/etc/caddy/Caddyfile`
- gethomepage.dev config at `/home/fernando/docker/homepage/config/`
- OVH API credentials (optional — set `OVH_ENDPOINT`, `OVH_APP_KEY`, `OVH_APP_SECRET`, `OVH_CONSUMER_KEY`)

## Sub-Agents

The orchestrator delegates all work to four domain-specific sub-agents:

| Agent | Path | Domain |
|---|---|---|
| `dns-manager` | `agents/vps-sysadmin/agents/dns-manager/` | OVH API DNS records |
| `docker-manager` | `agents/vps-sysadmin/agents/docker-manager/` | Portainer stack lifecycle |
| `proxy-configurator` | `agents/vps-sysadmin/agents/proxy-configurator/` | Caddy reverse proxy |
| `homepage-publisher` | `agents/vps-sysadmin/agents/homepage-publisher/` | Homepage dashboard widgets |

## Usage

```
Deploy Immich
Add N8n to my server
Check what services are running
Update Caddy config for jellyfin.fds81.tech
```
