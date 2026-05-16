# Domain Context — Homepage Publisher

gethomepage.dev dashboard terminology for the homepage-publisher sub-agent. Read before any config change.

## Language

**services.yaml**: The YAML file at `/home/fernando/docker/homepage/config/services.yaml` that defines all service widgets on the dashboard.
_Avoid_: "homepage config", "dashboard config"

**Widget**: A card on the gethomepage.dev dashboard showing a service's status, link, and optional live data. Each service gets exactly one widget.
_Avoid_: "card", "tile", "entry"

**Icon**: The visual identifier for a service widget. Uses Simple Icons (`si-` prefix) or Material Design Icons (`mdi-` prefix).
_Avoid_: "logo", "favicon"

**Widget type**: An optional parameter for gethomepage.dev widgets that support live data (e.g., `type: tautulli`, `type: portainer`). Omitted for simple link entries.
_Avoid_: "service type", "integration"

**Group**: A visual grouping of related services on the homepage (e.g., "Media", "Monitoring", "Productivity").
_Avoid_: "category", "section"

**Environment variable reference**: Homepage supports `{{HOMEPAGE_VAR_NAME}}` syntax in YAML for API keys. The actual values live in a `.env` file or Docker environment variables.
_Avoid_: "template var", "placeholder"

## Relationships

- A **Service** has exactly one **Widget** in services.yaml
- A **Widget** belongs to exactly one **Group**
- A **Widget** has exactly one **Icon**
- A **Widget** optionally has one **Widget type**

## Example dialogue

> **Orchestrator:** "Add Immich to homepage"
> **homepage-publisher:** "Current services.yaml has 8 widgets. Proposing: Immich under Media group, icon si-immich, href https://immich.fds81.tech, no live widget. Confirm?"
> **User:** "Yes"
> **homepage-publisher:** "Appended. Immich widget is on the dashboard."
