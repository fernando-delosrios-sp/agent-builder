---
name: audit-connector
description: |
  Scan a @sailpoint/connector-sdk repository and produce a structured performance audit report.
  Detects: missing pagination, missing keepAlive, sequential async chains, schema bloat, missing caching, and logging overhead.
  Use when user says "audit this connector", "check performance", "find perf issues", "scan connector", or starts a performance review session.
---

# Skill: Audit Connector

Scans the entire connector repository and emits a severity-tiered performance report.

## Step 1 — Discover Files

Find all auditable source files:

```bash
find . -type f \( -name "*.ts" -o -name "*.js" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/dist/*" \
  ! -name "*.generated.*" \
  ! -name "*.d.ts"
```

Also read `package.json` (schema/dependency checks) and `connector-spec.json` or equivalent schema file if present.

## Step 2 — Pattern Detection

For each file, check the following patterns in order:

### P1 — Pagination (Critical)
- Look for `.send(` or `res.send(` called inside a handler (`stdAccountList`, `stdEntitlementList`, `stdGroupList`) **without** a loop or chunking logic.
- Anti-pattern: a single `res.send(allAccounts)` where `allAccounts` could be > 100 items.
- Fix: wrap in a chunked loop using `res.send(chunk)` per batch (recommended batch: 100–500 items).

### P2 — KeepAlive (High)
- Look for handler functions where the total async execution time could exceed 30 seconds (indicators: multiple sequential `await` calls to external APIs, large dataset iteration) **without** a `res.keepAlive()` call.
- Fix: add `res.keepAlive()` every 20–25 seconds via `setInterval`.

### P3 — Async Parallelism (High)
- Look for sequential `await` calls in a loop (`for ... of` with `await` inside) where the iterations are independent.
- Also look for sequential `await a(); await b();` where `a` and `b` are independent.
- Fix: replace with `Promise.all([a(), b()])` or `Promise.allSettled(items.map(...))`.

### P4 — Schema Hygiene (Medium)
- Compare attributes fetched from the target system (object keys returned from API calls) against attributes declared in the connector schema.
- Flag any fetched attribute not present in the schema as dead payload.
- Fix: remove unused attribute from the API projection or add it to the schema if it's needed.

### P5 — Caching / Data Store (Medium)
- Look for repeated API calls using the same endpoint/parameters across multiple handler invocations without caching.
- Indicators: helper functions called from multiple handlers that make the same HTTP request.
- Fix: leverage the SDK `State` object or an in-memory Map with a TTL for slow-changing data (e.g., role/group lists).

### P6 — Logging Overhead (Low)
- Look for `console.log`, `console.debug`, or custom logger calls **inside `for` loops** or inside handler functions that iterate over large collections.
- Fix: move log statements outside the loop or gate them behind a log-level check.

## Step 3 — Emit Report

Output a Markdown table:

```markdown
## Performance Audit Report

| File | Line | Category | Severity | Finding | Proposed Fix |
|------|------|----------|----------|---------|--------------|
| src/account-list.ts | 42 | Pagination | 🔴 Critical | `res.send(accounts)` sends full list in one call | Chunk into batches of 250 with loop |
| ... | ... | ... | ... | ... | ... |

### Summary
- 🔴 Critical: N
- 🟠 High: N
- 🟡 Medium: N
- 🟢 Low: N
```

Hand off to `refactor-connector` skill for the fix phase.
