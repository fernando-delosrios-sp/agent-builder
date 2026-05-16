# Domain Context — Proxy Configurator

Caddy reverse proxy terminology for the proxy-configurator sub-agent. Read before any config change.

## Language

**Caddyfile**: The Caddy configuration file at `/etc/caddy/Caddyfile` inside the caddy container. Defines all reverse proxy rules.
_Avoid_: "proxy config", "nginx config", "caddy config"

**Reverse proxy entry**: A Caddyfile block mapping a hostname to a backend service. Format: `{hostname} { reverse_proxy {target} }`.
_Avoid_: "proxy rule", "vhost"

**Hostname**: The public domain for the service, e.g., `uptime.fds81.tech`. Always uses HTTPS (Caddy handles TLS automatically).
_Avoid_: "domain", "URL"

**Target**: The internal Docker container name and port, e.g., `uptime-kuma:3001`. Must be reachable on `caddy-net`.
_Avoid_: "backend", "upstream"

**caddy adapt**: Validates the Caddyfile and outputs the normalized JSON config. Must succeed before `caddy reload`.
_Avoid_: "validate", "check config"

**caddy reload**: Gracefully applies a new Caddyfile without downtime. Zero-downtime config change.
_Avoid_: "restart caddy", "apply config"

## Relationships

- A **Service** has exactly one **Caddyfile entry** (reverse proxy rule)
- A **Caddyfile** contains many **Reverse proxy entries**
- Each **Reverse proxy entry** maps a **Hostname** to a **Target**
- **caddy adapt** must always precede **caddy reload**

## Example dialogue

> **Orchestrator:** "Add proxy for uptime.fds81.tech → uptime-kuma:3001"
> **proxy-configurator:** "Current Caddyfile has 5 entries. Proposed diff: + uptime.fds81.tech { reverse_proxy uptime-kuma:3001 }. Confirm?"
> **User:** "Yes"
> **proxy-configurator:** "Written. caddy adapt: OK. caddy reload: success. Uptime Kuma is live at https://uptime.fds81.tech."
