---
name: sailpoint-performance-review
description: |
  Optimizes SailPoint SaaS connectors for performance, throughput, and memory efficiency.
  Use when reviewing or optimizing code using @sailpoint/connector-sdk, especially when targeting the 512MB memory limit or increasing sync throughput.
---

# SailPoint Performance Review

Ensures SailPoint SaaS connectors stay within the 512MB memory limit and maximize sync throughput.

## Quick Start
"Review the `std-account-list` command for memory efficiency and ensure we are using streaming."

## Success Criteria
- Memory usage strictly < 512MB.
- `res.send()` payloads < 256KiB.
- Efficient pagination and streaming implemented.
- `res.keepAlive()` used for operations taking > 3 minutes.

## Instructions

### 1. Detect Performance Leaks
- **Memory Hogs**: Flag any array accumulation of records (e.g., `records.push(item)` in a loop).
- **Batching APIs**: Identify usage of `await fetchAll()` or similar non-streaming patterns.
- **Large Objects**: Detect `JSON.parse` or `JSON.stringify` on payloads that could exceed 1MB.
- **Missing Pagination**: Ensure loops fetching data from external APIs use offset/limit or cursor-based pagination.

### 2. Apply Streaming Patterns
- **Record Streaming**: Use `res.send(record)` immediately upon receipt from the source API.
- **Async Iterators**: Prefer `for await (const record of source)` over bulk fetching.
- **Projection**: Add field selection to source API calls to reduce data over-fetch.

### 3. Manage Timeouts
- For any command that might run for several minutes (like account aggregation), ensure `res.keepAlive()` is called periodically.

## Examples

### Batch to Stream Conversion
**Bad (Batching):**
```javascript
const users = await client.getUsers()
for (const user of users) {
    res.send(user)
}
```

**Good (Streaming):**
```javascript
await client.streamUsers(async (user) => {
    res.send(user)
})
```

## Validation
- Validate changes by running `spcx connector test` locally if possible.
