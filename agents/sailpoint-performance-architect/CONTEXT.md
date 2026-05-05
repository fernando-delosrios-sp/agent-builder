# SailPoint Connector Context

## Terminology

| Term | Definition |
|---|---|
| **SaaS Connector** | A Node.js application running in SailPoint's secure environment. |
| **std-account-list** | The core command for fetching all accounts from a target system. |
| **Streaming** | Sending records one by one via `res.send()` instead of in a bulk array. |
| **res.keepAlive()** | A function to prevent timeouts for long-running connector operations. |
| **spcx** | The command-line tool used to develop, test, and deploy connectors. |
| **Projection** | Selecting only a subset of fields from the target system to save memory/bandwidth. |

## Architecture Constraints
- **Runtime**: Node.js (V8 engine).
- **Memory**: 512MB limit (hard cap).
- **Network**: Payloads to SailPoint must be < 256KiB.
- **Timeout**: 10 minutes max for an execution, but 3 minutes without a "heartbeat" (response or keep-alive) will trigger a timeout.
