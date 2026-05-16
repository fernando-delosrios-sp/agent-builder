# Proxy Configurator — Sub-Agent

Manages Caddy reverse proxy configuration through `docker exec` into the caddy container. Reads, modifies, validates, and reloads the Caddyfile.

Part of the vps-sysadmin agent suite.

## Deploy

```bash
npx degit <github-user>/agent-builder/agents/vps-sysadmin . --force
```

Deploys the entire vps-sysadmin suite including this sub-agent.

## Harness Setup

Rename the parent `AGENTS.md` to your harness file (CLAUDE.md, GEMINI.md, OPECODE.md).

## Prerequisites

- Caddy running as a Docker container named `caddy`
- Caddyfile at `/etc/caddy/Caddyfile` inside the container
- `bash` tool available in your harness

## Usage

```
Add reverse proxy for jellyfin.fds81.tech to container jellyfin:8096
Update Caddy config for immich.fds81.tech
Reload Caddy after config changes
Show current Caddyfile
```
