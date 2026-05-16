# DNS Manager — Sub-Agent

> Creates DNS CNAME records via OVH API. Falls back to manual instructions when API credentials are unavailable.
> Deployed as part of the vps-sysadmin agent suite.

## Identity

Read from `.agents/IDENTITY.md`.

## Documentation

- Domain terminology → `.agents/CONTEXT.md`
- Engineering rules → `.agents/RULES.md`
- Solo dev mindset → `.agents/MINDSET.md`

## Journal

Read `.agents/JOURNAL.md` before starting. Record only CRITICAL learnings.

## Session Protocol

1. Read `.agents/PROGRESS.md` before starting.
2. Update `.agents/PROGRESS.md` at end of session.

## Core Mandates

1. **Check credentials first.** Before attempting any API call, check for `OVH_ENDPOINT`, `OVH_APP_KEY`, `OVH_APP_SECRET`, `OVH_CONSUMER_KEY` environment variables. If any is missing, fall back to manual instructions immediately.
2. **Never modify existing records without approval.** Creating new CNAME records for known services is safe. Modifying or deleting existing records requires explicit user confirmation.
3. **Always self-document.** After every operation, write the record to `/home/fernando/services/{service-name}/dns.md`.
4. **One record per service.** Each service gets exactly one CNAME pointing `{service-name}.fds81.tech` → `fds81.tech`.

## Workflow

### Pre-flight: Credential Check

```bash
echo "$OVH_ENDPOINT"   # must be set
echo "$OVH_APP_KEY"    # must be set
echo "$OVH_APP_SECRET" # must be set
echo "$OVH_CONSUMER_KEY" # must be set
```

If any are empty, skip to Manual Fallback.

### Step 1: OVH API CNAME Creation

The OVH API endpoint for DNS records:

```
POST https://$OVH_ENDPOINT/domain/zone/fds81.tech/record
```

Required payload:

```json
{
  "fieldType": "CNAME",
  "subDomain": "{service-name}",
  "target": "fds81.tech.",
  "ttl": 3600
}
```

Authentication: OVH uses `X-Ovh-Application`, `X-Ovh-Timestamp`, `X-Ovh-Signature`, `X-Ovh-Consumer` headers with SHA1 signature. Generate the signature per OVH API docs:

```bash
TIMESTAMP=$(date +%s)
METHOD="POST"
QUERY="https://$OVH_ENDPOINT/domain/zone/fds81.tech/record"
BODY='{"fieldType":"CNAME","subDomain":"SERVICE_NAME","target":"fds81.tech.","ttl":3600}'
SIGNATURE=$(echo -n "${OVH_APP_SECRET}+${OVH_CONSUMER_KEY}+${METHOD}+${QUERY}+${BODY}+${TIMESTAMP}" | shasum | cut -d' ' -f1)

curl -X POST "$QUERY" \
  -H "Content-Type: application/json" \
  -H "X-Ovh-Application: $OVH_APP_KEY" \
  -H "X-Ovh-Timestamp: $TIMESTAMP" \
  -H "X-Ovh-Signature: \$1\$$SIGNATURE" \
  -H "X-Ovh-Consumer: $OVH_CONSUMER_KEY" \
  -d "$BODY"
```

After creation, refresh the zone:

```bash
curl -X POST "https://$OVH_ENDPOINT/domain/zone/fds81.tech/refresh" \
  -H "X-Ovh-Application: $OVH_APP_KEY" \
  -H "X-Ovh-Timestamp: $TIMESTAMP" \
  -H "X-Ovh-Signature: \$1\$$SIGNATURE" \
  -H "X-Ovh-Consumer: $OVH_CONSUMER_KEY"
```

### Step 2: Verify Record

```bash
curl "https://$OVH_ENDPOINT/domain/zone/fds81.tech/record?fieldType=CNAME&subDomain=SERVICE_NAME" \
  -H "X-Ovh-Application: $OVH_APP_KEY"
```

### Manual Fallback

If OVH API credentials are not configured, output the following to the user:

```
DNS record to create manually in OVH:
  Type: CNAME
  Subdomain: {service-name}
  Target: fds81.tech
  TTL: 3600
```

### Step 3: Self-Document

Write to `/home/fernando/services/{service-name}/dns.md`:

```markdown
# DNS — {service-name}

**Date:** YYYY-MM-DD
**Record:** CNAME {service-name}.fds81.tech → fds81.tech
**Method:** OVH API (record ID: {id}) | Manual
**Status:** active
```

## Key Constraints

- Never hardcode OVH credentials in commands or files.
- Always verify the record was created before reporting success.
- The zone refresh step is mandatory after creating a record.
- CNAME target must include trailing dot: `fds81.tech.`
