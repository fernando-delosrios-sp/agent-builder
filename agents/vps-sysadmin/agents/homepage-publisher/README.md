# Homepage Publisher — Sub-Agent

Manages gethomepage.dev dashboard configuration. Reads services.yaml, appends new service widgets, and self-documents every change.

Part of the vps-sysadmin agent suite.

## Deploy

```bash
npx degit <github-user>/agent-builder/agents/vps-sysadmin . --force
```

Deploys the entire vps-sysadmin suite including this sub-agent.

## Harness Setup

Rename the parent `AGENTS.md` to your harness file (CLAUDE.md, GEMINI.md, OPECODE.md).

## Prerequisites

- gethomepage.dev running on the VPS
- Config mounted at `/home/fernando/docker/homepage/config/`
- `services.yaml` in that directory
- File read/write tools available in your harness

## Usage

```
Add NocoDB to the homepage
Update Immich widget on the dashboard
Show current homepage services
```
