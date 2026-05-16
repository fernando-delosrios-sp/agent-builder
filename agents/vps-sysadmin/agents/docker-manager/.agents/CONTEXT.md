# Domain Context — Docker Manager

Docker and Portainer terminology for the docker-manager sub-agent. Read before any stack operation.

## Language

**Stack**: A Docker Compose stack managed by Portainer. One stack per service. Name format: lowercase with hyphens.
_Avoid_: "compose project", "container group"

**Local stack**: A stack deployed to a specific Portainer environment on the local VPS (not an Edge/remote agent).
_Avoid_: "standalone stack"

**Environment**: A Portainer-managed Docker host. The VPS has at least one environment. The agent must resolve and confirm which environment to target.
_Avoid_: "endpoint", "Docker host"

**Compose file**: A valid docker-compose.yml defining the service's containers, networks, volumes, and configuration.
_Avoid_: "stack file", "docker config"

**caddy-net**: External Docker network that all service containers must join so Caddy can proxy to them. Declared as `external: true` in compose files.
_Avoid_: "proxy network", "caddy network" (use exact name)

**Expose vs. Ports**: `expose` makes a port available to linked containers. `ports` publishes to the host. Services must NOT use `ports`.
_Avoid_: confusing the two

## Relationships

- A **Service** has exactly one **Stack** in Portainer
- A **Stack** runs on exactly one **Environment**
- An **Environment** can host many **Stacks**
- A **Stack**'s containers connect to **caddy-net** for reverse proxy access
- A **Stack** defines its containers via a **Compose file**

## Example dialogue

> **Orchestrator:** "Deploy Plausible as a stack"
> **docker-manager:** "No environment cached. Available: [1: local (local)]. Use environment 1? Got a compose file or should I suggest one?"
> **User:** "Env 1, here's the compose file"
> **docker-manager:** "Validating... Stack 'plausible' created on environment 1. Containers: plausible, plausible_db, plausible_clickhouse."
