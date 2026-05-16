# Domain Context

Domain terminology for the VPS Sysadmin agent and its sub-agents. Read before making any operational decision.

## Usage

Maintained via `grill-with-docs` methodology. Challenge against the glossary, sharpen fuzzy language, capture decisions immediately.

---

## Language

**Service**: A self-contained application deployed on the VPS (e.g., Immich, N8n, Jellyfin). Each service has a unique name used across DNS, Docker, Caddy, and Homepage configs.
_Avoid_: "app", "container" (a container IS the runtime of a service, not the service itself)

**Stack**: A Docker Compose stack managed by Portainer. Each stack corresponds to exactly one service. Stack names are lowercase with hyphens (e.g., `uptime-kuma`).
_Avoid_: "container group", "compose project"

**CNAME record**: An OVH DNS alias pointing a subdomain to `fds81.tech`. Service access pattern: `{service-name}.fds81.tech`.
_Avoid_: "DNS alias", "subdomain record"

**Caddyfile**: The configuration file at `/etc/caddy/Caddyfile` inside the caddy container. Defines reverse proxy rules mapping hostnames to service containers.
_Avoid_: "proxy config", "nginx config"

**services.yaml**: The gethomepage.dev widget configuration file at `/home/fernando/docker/homepage/config/services.yaml`. Each service deployed gets a widget entry here.
_Avoid_: "homepage config", "dashboard config"

**Service Record**: Documentation directory at `/home/fernando/services/{service-name}/` containing installation details written by each sub-agent.
_Avoid_: "install log", "deployment log"

**Portainer Environment**: A Docker host managed by Portainer. All stacks are deployed to a specific environment ID.
_Avoid_: "Docker endpoint", "swarm node"

**caddy-net**: The shared Docker network that connects Caddy to all service containers for reverse proxy routing.
_Avoid_: "proxy network", "traefik network"

## Relationships

- A **Service** has exactly one **Stack** in Portainer
- A **Service** has exactly one **CNAME record** pointing to `fds81.tech`
- A **Service** has exactly one **Caddyfile entry** (reverse proxy rule)
- A **Service** has exactly one widget entry in **services.yaml**
- A **Service** has exactly one **Service Record** directory
- A **Stack** runs on exactly one **Portainer Environment**
- Multiple **Stack** containers connect to **caddy-net**
- **caddy-net** connects exactly one **caddy container** to all service **Stack** containers

## Example dialogue

> **Dev:** "Deploy Jellyfin on the VPS."
> **Orchestrator:** "Creating DNS CNAME for jellyfin.fds81.tech, deploying Jellyfin stack via Portainer, adding Caddy reverse proxy, and publishing to homepage."
> **Orchestrator:** "Done. DNS: jellyfin.fds81.tech → fds81.tech. Stack: jellyfin deployed to env 2. Proxy: reverse proxy to jellyfin:8096. Homepage: widget added."

## Flagged ambiguities

- "DNS" was used to mean both CNAME creation (sub-agent domain) and DNS resolution checking (a pre-flight step) — resolved: dns-manager handles both
- "config" was used to mean Caddyfile, docker-compose, and homepage yaml — resolved: each sub-agent owns its specific config type
