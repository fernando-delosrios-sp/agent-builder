# Domain Context — DNS Manager

DNS terminology for the dns-manager sub-agent. Read before any DNS operation.

## Language

**CNAME record**: A DNS alias record pointing a subdomain to the apex domain. Format: `{service}.fds81.tech → fds81.tech.`
_Avoid_: "alias", "redirect record"

**Zone**: The DNS zone for `fds81.tech` managed by OVH. All records live under this zone.
_Avoid_: "domain config", "DNS settings"

**Zone refresh**: After creating or modifying records, the zone must be refreshed for changes to propagate to OVH nameservers.
_Avoid_: "reload", "apply"

**OVH signature**: A SHA1 hash combining the application secret, consumer key, HTTP method, full URL, request body, and timestamp — required for OVH API authentication.
_Avoid_: "API key", "auth token"

**Manual fallback**: When OVH API credentials are not set, output exact DNS record details for manual creation in the OVH control panel.
_Avoid_: "skip", "fail"

## Relationships

- A **Service** has exactly one **CNAME record** on the `fds81.tech` zone
- A **Zone** contains many **CNAME records**
- A **Zone refresh** is required after any record mutation

## Example dialogue

> **Orchestrator:** "Create CNAME for uptime.fds81.tech"
> **dns-manager:** "OVH credentials present. Creating CNAME record: uptime → fds81.tech. Zone refreshed. Record ID: 12345."

> **Orchestrator:** "Create CNAME for jellyfin.fds81.tech"
> **dns-manager:** "OVH credentials not set. Please create manually in OVH control panel: Type CNAME, Subdomain jellyfin, Target fds81.tech, TTL 3600."
