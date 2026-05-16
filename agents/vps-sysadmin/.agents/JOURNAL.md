# JOURNAL — Critical Learnings Only

Your journal is NOT a log. Only add entries for CRITICAL architecture and operations learnings.

## When to add an entry

Add journal entries only when you discover:
- A deployment pattern that caused a failure, outage, or rework
- An infrastructure change with unexpected side effects
- A rejected approach with important constraints to remember
- A surprising gap in service configuration, networking, or DNS
- A reusable pattern or guardrail worth encoding for future deployments

Do NOT journal routine work such as:
- "Deployed service X"
- "Updated Caddy config"
- "Added DNS record"

## Entry format

```
## YYYY-MM-DD - [Title]
**Discovery:** [What you found]
**Learning:** [Why it existed / root cause]
**Prevention:** [How to avoid next time]
```
