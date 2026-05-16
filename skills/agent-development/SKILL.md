---
name: Agent Development
description: This skill should be used when the user asks to "create an agent", "add an agent", "write a subagent", "agent frontmatter", "when to use description", "agent examples", "agent tools", "agent colors", "autonomous agent", or needs guidance on agent structure, system prompts, triggering conditions, or agent development best practices.
---

# Agent Development

## Core Convention

Every agent file is named `AGENTS.md` (plural, never `AGENT.md`). The user renames `AGENTS.md` to their harness file (e.g., `CLAUDE.md`, `GEMINI.md`) at deployment. Only `AGENTS.md` is emitted — never create separate harness files.

## Agent File Structure

### Complete Format

```markdown
---
name: agent-identifier
description: Use this agent when [triggering conditions]. Examples:

<example>
Context: [Situation description]
user: "[User request]"
assistant: "[How assistant should respond and use this agent]"
<commentary>
[Why this agent should be triggered]
</commentary>
</example>

model: inherit
color: blue
tools: ["Read", "Write", "Grep"]
---

You are [agent role description]...

**Your Core Responsibilities:**
1. [Responsibility 1]
2. [Responsibility 2]

**Process:**
[Step-by-step workflow]

**Output Format:**
[What to return]
```

## Frontmatter Fields

### name (required)

Agent identifier used for namespacing and invocation.

**Format:** lowercase, numbers, hyphens only
**Length:** 3-50 characters
**Pattern:** Must start and end with alphanumeric

### description (required)

Defines when the agent should be triggered. **This is the most critical field.**

**Must include:**
1. Triggering conditions ("Use this agent when...")
2. Multiple `<example>` blocks showing usage
3. Context, user request, and assistant response in each example

### model (required)

Which model the agent should use. Options: `inherit` (recommended) or harness-specific values.

### color (required)

Visual identifier: `blue`, `cyan`, `green`, `yellow`, `magenta`, `red`

### tools (optional)

Restrict agent to specific tools. Best practice: limit to minimum needed.

## System Prompt Design

Write in second person, addressing the agent directly.

```markdown
You are [role] specializing in [domain].

**Your Core Responsibilities:**
1. [Primary responsibility]
2. [Secondary responsibility]

**Process:**
1. [Step one]
2. [Step two]

**Quality Standards:**
- [Standard 1]
- [Standard 2]

**Output Format:**
- [What to include]

**Edge Cases:**
- [Edge case 1]: [How to handle]
```

### Best Practices

DO: Write in second person, be specific, provide step-by-step process, define output format.
DON'T: Write in first person, be vague, omit process steps, ignore error cases.

## Agent Organization

All agents go into `agents/<name>/`. Supporting docs go into `docs/`. Sub-agents go into `agents/<name>/agents/<sub>/`.

```
agents/<name>/
├── AGENTS.md              # Main instruction file (user renames at deploy)
├── README.md              # degit deploy command
├── docs/                  # Supporting documentation
│   ├── IDENTITY.md
│   ├── CONTEXT.md
│   ├── JOURNAL.md
│   ├── MINDSET.md
│   ├── PROGRESS.md
│   └── RULES.md
└── agents/                # Sub-agents (if multi-agent)
    └── <sub-agent>/
        └── AGENTS.md
```

## Quick Reference

| Field | Required | Format | Example |
|---|---|---|---|
| name | Yes | lowercase-hyphens | code-reviewer |
| description | Yes | Text + examples | Use when... <example>... |
| model | Yes | inherit | inherit |
| color | Yes | Color name | blue |
| tools | No | Array of tool names | ["Read", "Grep"] |

NEVER create files named `AGENT.md` (singular) — always `AGENTS.md`.
