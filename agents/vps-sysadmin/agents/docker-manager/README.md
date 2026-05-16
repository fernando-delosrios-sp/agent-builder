# Docker Manager — Sub-Agent

Manages Docker stack lifecycle exclusively through Portainer MCP tools. Creates, starts, stops, inspects, and deletes stacks.

Part of the vps-sysadmin agent suite.

## Deploy

```bash
npx degit <github-user>/agent-builder/agents/vps-sysadmin . --force
```

Deploys the entire vps-sysadmin suite including this sub-agent.

## Harness Setup

Rename the parent `AGENTS.md` to your harness file (CLAUDE.md, GEMINI.md, OPECODE.md).

## Prerequisites

- Portainer running and accessible via MCP tools
- Portainer MCP tools configured in your harness:
  - `portainer_listEnvironments`
  - `portainer_createLocalStack`
  - `portainer_listLocalStacks`
  - `portainer_startLocalStack`
  - `portainer_stopLocalStack`
  - `portainer_deleteLocalStack`
  - `portainer_dockerProxy`
- A `caddy-net` Docker network for service connectivity

## Usage

```
Deploy Plausible as a Docker stack
List all running stacks
Stop the n8n stack
Show container logs for uptime-kuma
```
