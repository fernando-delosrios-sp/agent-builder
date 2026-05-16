# DNS Manager — Sub-Agent

OVH API DNS record management for `fds81.tech`. Creates CNAME records, verifies DNS propagation, and self-documents every change.

Part of the vps-sysadmin agent suite.

## Deploy

```bash
npx degit <github-user>/agent-builder/agents/vps-sysadmin . --force
```

Deploys the entire vps-sysadmin suite including this sub-agent.

## Harness Setup

Rename the parent `AGENTS.md` to your harness file (CLAUDE.md, GEMINI.md, OPECODE.md).

## Prerequisites

- OVH API credentials set as environment variables:
  - `OVH_ENDPOINT`
  - `OVH_APP_KEY`
  - `OVH_APP_SECRET`
  - `OVH_CONSUMER_KEY`
- If credentials are missing, the agent falls back to manual DNS instructions.

## Usage

```
Create a CNAME for uptime.fds81.tech
Check if jellyfin.fds81.tech has a DNS record
What DNS records exist for fds81.tech?
```
