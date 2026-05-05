---
name: refactor-connector
description: |
  Apply confirmed performance fixes to a @sailpoint/connector-sdk TypeScript project.
  Works from an audit report produced by the audit-connector skill.
  Proposes each fix as a diff, waits for user confirmation, then applies it.
  Use when user says "fix the issues", "apply the fixes", "refactor connector", or after an audit-connector report is complete.
---

# Skill: Refactor Connector

Applies performance fixes to the connector codebase, one confirmed fix at a time.

## Prerequisites

An audit report from `audit-connector` must be available (in context or as a file). If not present, invoke `audit-connector` first.

## Step 1 — Fetch Live SDK Docs

Before writing any fix, fetch current SDK documentation:

```bash
npx ctx7@latest library @sailpoint/connector-sdk "connector response keepAlive send pagination"
# Use the returned ID to fetch docs:
npx ctx7@latest docs <id> "res.send pagination keepAlive state caching"
```

Use the returned documentation to validate fix patterns against the current SDK API. Do not rely on training data for SDK method signatures.

## Step 2 — Fix Loop

Process findings in severity order: Critical → High → Medium → Low.

For each finding:

### 2a — Present the Diff

Show the current code and proposed replacement in unified diff format:

```
File: src/handlers/account-list.ts (Line 38–55)

- const accounts = await fetchAllAccounts();
- res.send(accounts);
+ const accounts = await fetchAllAccounts();
+ const CHUNK_SIZE = 250;
+ for (let i = 0; i < accounts.length; i += CHUNK_SIZE) {
+   res.send(accounts.slice(i, i + CHUNK_SIZE));
+ }
```

### 2b — Ask for Confirmation

```
Apply this fix? 
  [yes] Apply
  [no]  Skip this finding
  [skip-critical] Skip all Critical findings
  [skip-high]     Skip all High findings
  [skip-medium]   Skip all Medium findings
  [skip-low]      Skip all Low findings
```

### 2c — Apply

On "yes": apply the edit to the file using the file editing tools. Log the change.

On "no" or "skip-*": mark the finding as **Deferred** in the report and move on.

## Fix Patterns Reference

### Pagination Fix
```typescript
// Before
res.send(allAccounts);

// After
const CHUNK_SIZE = 250;
for (let i = 0; i < allAccounts.length; i += CHUNK_SIZE) {
  res.send(allAccounts.slice(i, i + CHUNK_SIZE));
}
```

### KeepAlive Fix
```typescript
// Add at the start of a long-running handler
const keepAliveTimer = setInterval(() => res.keepAlive(), 20_000);
try {
  // ... long operation ...
} finally {
  clearInterval(keepAliveTimer);
}
```

### Async Parallelism Fix
```typescript
// Before (sequential)
const users = await fetchUsers();
const groups = await fetchGroups();

// After (parallel)
const [users, groups] = await Promise.all([fetchUsers(), fetchGroups()]);
```

### Loop Parallelism Fix
```typescript
// Before (sequential loop)
for (const id of ids) {
  const detail = await fetchDetail(id);
  results.push(detail);
}

// After (parallel with concurrency control)
const results = await Promise.all(ids.map(id => fetchDetail(id)));
// For large lists, use a concurrency-limited variant:
// import pLimit from 'p-limit'; const limit = pLimit(10);
// const results = await Promise.all(ids.map(id => limit(() => fetchDetail(id))));
```

### Caching Fix
```typescript
// Use SDK State for cross-invocation caching
import { ConnectorContext } from '@sailpoint/connector-sdk';

async function getCachedGroups(context: ConnectorContext): Promise<Group[]> {
  const cached = await context.getState('groups_cache');
  if (cached) return JSON.parse(cached);
  const groups = await fetchGroupsFromTarget();
  await context.setState('groups_cache', JSON.stringify(groups));
  return groups;
}
```

### Logging Fix
```typescript
// Before (inside loop)
for (const account of accounts) {
  console.log(`Processing account: ${account.id}`);
  // ...
}

// After (outside loop with summary)
logger.debug(`Processing ${accounts.length} accounts`);
for (const account of accounts) {
  // ...
}
```

## Step 3 — Validate

After all confirmed fixes are applied:

```bash
npm run build   # Verify TypeScript compilation
npm test        # Run tests if they exist
```

Report results. If build or tests fail, offer to revert the last applied fix.

## Step 4 — Final Report

Emit a summary:

```markdown
## Refactor Summary

| Finding | Severity | Status |
|---------|----------|--------|
| Pagination in account-list.ts:42 | 🔴 Critical | ✅ Applied |
| KeepAlive missing in group-list.ts:18 | 🟠 High | ✅ Applied |
| Sequential awaits in entitlement-list.ts:67 | 🟠 High | ⏭️ Deferred |

Build: ✅ Pass  
Tests: ✅ Pass (12/12)
```
