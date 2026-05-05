# SailPoint Connector Performance Agent

A performance auditor and refactoring specialist for [`@sailpoint/connector-sdk`](https://developer.sailpoint.com/docs/connectivity/saas-connectivity/) TypeScript projects.

**Persona:** Perf — audits connectors for pagination issues, keepAlive gaps, async anti-patterns, schema bloat, caching misses, and logging overhead. Proposes and applies fixes with explicit user confirmation.

## Deploy to a connector project

Run this command from the **root of your connector project**:

```bash
npx degit fernando-delosrios-sp/agent-builder/agents/sailpoint-connector-perf . --force
```

`--force` is required when deploying into an existing project directory (which is always the case).

This downloads the full agent into your current directory — all harness files and skills in one shot. No git history, no full repo clone.

### Multi-harness by default

Every harness file (`GEMINI.md`, `CLAUDE.md`, `CURSOR.md`) is a thin identity header that delegates to the shared `AGENT.md`. Deploy once — **all your AI tools become Perf simultaneously**:

```
<your-connector-project>/
├── GEMINI.md          # Gemini CLI       ─┐
├── CLAUDE.md          # Claude Code       ├─ each just sets identity,
├── CURSOR.md          # Cursor            │  then reads AGENT.md
├── AGENT.md           # Source of truth  ─┘  (one place to update)
└── .agents/
    └── skills/              # Auto-discovered by all harnesses
        ├── audit-connector/SKILL.md    # Phase 1–2: scan & report
        └── refactor-connector/SKILL.md # Phase 3–4: confirm & fix
```

If you only use one harness, delete the others — they're independent files. Restart your AI agent after install and it will automatically pick up the relevant harness file.

### Install upstream skills

The agent references two optional upstream skills. Install them for the full experience:

```bash
# Live SDK docs (always verify against current API)
npx skills add upstash/context7 --skill context7-cli --all -y

# Find reusable skills before writing new code
npx skills add vercel-labs/skills --skill find-skills --all -y
```

## Usage

Once deployed, trigger the agent by saying:

- `"audit this connector"` — runs a full performance scan and produces a report
- `"improve connector performance"` — scan + propose + apply confirmed fixes
- `"fix perf issues"` — same as above
- `"check my sailpoint connector"` — alias for audit

The agent always **audits before fixing** and **proposes every change before applying it**.

## Performance categories

| Severity | Category | What it detects |
|---|---|---|
| Critical | Pagination | Full list sent in one `res.send()` with no chunking |
| High | Timeout / KeepAlive | Operations >30 s without `res.keepAlive()` |
| High | Async Parallelism | Sequential `await` chains that could use `Promise.all()` |
| Medium | Schema Hygiene | Attributes fetched but absent from the connector schema |
| Medium | Caching | Repeated identical API calls with no cache |
| Low | Logging Overhead | `console.log` inside loops or hot paths |

## Deploying alongside an existing agent (orchestrator setup)

If your project already has a root `GEMINI.md` / `CLAUDE.md` (an existing primary agent), deploy Perf as a **sub-agent** instead of overwriting your root files:

```bash
# Deploy into a subdirectory — harness files stay out of the root
npx degit fernando-delosrios-sp/agent-builder/agents/sailpoint-connector-perf agents/perf --force
```

Then register it in your orchestrator's `AGENTS.md` so all harnesses can route to it:

```markdown
## agents/perf — SailPoint Connector Performance Auditor

Delegates performance auditing and refactoring to the Perf agent.
Invoke when the user asks to audit, optimize, or fix connector performance.
```

The sub-agent still gets all harness files under `agents/perf/` — Gemini, Claude, and Cursor can all reach it. The orchestrator handles routing; each sub-agent file handles identity.

See the [agent-builder README](../../README.md#multi-agent-setup) for the full orchestrator pattern.

## Source

Built with [agent-builder](https://github.com/fernando-delosrios-sp/agent-builder).
