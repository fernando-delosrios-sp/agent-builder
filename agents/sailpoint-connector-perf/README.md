# SailPoint Connector Performance Agent

A performance auditor and refactoring specialist for [`@sailpoint/connector-sdk`](https://developer.sailpoint.com/docs/connectivity/saas-connectivity/) TypeScript projects.

**Persona:** Perf — audits connectors for pagination issues, keepAlive gaps, async anti-patterns, schema bloat, caching misses, and logging overhead. Proposes and applies fixes with explicit user confirmation.

## Deploy to a connector project

Run this command from the **root of your connector project**:

```bash
npx degit fernando-delosrios-sp/agent-builder/agents/sailpoint-connector-perf .
```

This downloads the full agent (harness files + skills) into your current directory. No git history, no full repo clone.

### What gets installed

```
<your-connector-project>/
├── GEMINI.md          # Gemini CLI — activates "Perf" identity
├── CLAUDE.md          # Claude Code — activates "Perf" identity
├── CURSOR.md          # Cursor — activates "Perf" identity
├── AGENT.md           # Harness-agnostic core: workflow, mandates, categories
└── skills/
    ├── audit-connector/SKILL.md    # Phase 1–2: scan & report
    └── refactor-connector/SKILL.md # Phase 3–4: confirm & fix
```

After install, restart your AI agent. It will automatically load `GEMINI.md` (or the relevant harness file) and become **Perf**.

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

## Multi-agent setup

If your project already has an orchestrator agent (e.g., a root `GEMINI.md`), deploy this agent as a **sub-agent** instead:

```bash
# Deploy into a subdirectory, not the project root
npx degit fernando-delosrios-sp/agent-builder/agents/sailpoint-connector-perf agents/perf
```

Then reference it from your orchestrator's `AGENTS.md`:

```markdown
## agents/perf — SailPoint Connector Performance Auditor

Delegates performance auditing and refactoring to the Perf agent.
Invoke when the user asks to audit, optimize, or fix connector performance.
```

See the [agent-builder README](../../README.md#multi-agent-setup) for the full multi-agent architecture pattern.

## Source

Built with [agent-builder](https://github.com/fernando-delosrios-sp/agent-builder).
