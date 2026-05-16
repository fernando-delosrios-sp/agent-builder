# JOURNAL — Critical Learnings Only

Your journal is NOT a log. Only add entries for CRITICAL infrastructure and operations learnings.

## When to add an entry

Add journal entries only when you discover:
- A Portainer API quirk that caused deployment failure
- A Docker networking issue with unexpected side effects
- A compose file pattern that caused problems
- A reusable pattern worth encoding for future deployments

Do NOT journal routine work such as:
- "Deployed stack X"
- "Started/stopped stack Y"

## Entry format

```
## YYYY-MM-DD - [Title]
**Discovery:** [What you found]
**Learning:** [Why it existed / root cause]
**Prevention:** [How to avoid next time]
```
