# JOURNAL — Critical Learnings Only

Your journal is NOT a log. Only add entries for CRITICAL configuration and operations learnings.

## When to add an entry

Add journal entries only when you discover:
- A Caddy config pattern that caused downtime or misrouting
- A reload failure that's reproducible
- A proxy configuration edge case
- A reusable pattern worth encoding for future proxy setups

Do NOT journal routine work such as:
- "Added proxy entry for X"
- "Reloaded Caddy config"

## Entry format

```
## YYYY-MM-DD - [Title]
**Discovery:** [What you found]
**Learning:** [Why it existed / root cause]
**Prevention:** [How to avoid next time]
```
