---
name: skill-creator
description: Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, or optimize a skill's description for better triggering accuracy.
---

# Skill Creator

A skill for creating new skills and iteratively improving them.

## Process Overview

1. Capture intent — what should the skill do, when should it trigger
2. Draft the SKILL.md
3. Test with sample prompts
4. Evaluate results (qualitative + quantitative)
5. Iterate until satisfied

## Creating a Skill

### Capture Intent

1. What should this skill enable the agent to do?
2. When should this skill trigger? (what user phrases/contexts)
3. What's the expected output format?

### Writing the SKILL.md

Based on the interview, fill in:
- **name**: Skill identifier (lowercase, hyphens)
- **description**: When to trigger, what it does. Primary triggering mechanism. Include both what the skill does AND specific contexts for when to use it. Be pushy — models undertrigger skills.
- **body**: Markdown instructions with clear workflow steps

### Skill Anatomy

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description required)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/    - Executable code for deterministic tasks
    ├── references/ - Docs loaded into context as needed
    └── assets/     - Files used in output (templates, icons)
```

### Progressive Disclosure

Skills use three-level loading:
1. **Metadata** (name + description) — Always in context
2. **SKILL.md body** — When skill triggers (<500 lines ideal)
3. **Bundled resources** — As needed

### Writing Style

- Use imperative form
- Explain **why** things matter rather than heavy-handed MUSTs
- Define output formats with clear templates
- Include examples showing input and expected output

## Testing Skills

Create 2-3 realistic prompts that real users would type. Run the skill and evaluate outputs.

## Improving the Skill

1. Generalize from feedback — don't overfit to test examples
2. Keep the prompt lean — remove things that aren't pulling weight
3. Explain the **why** — models work better with reasoning than rigid MUSTs
4. Look for repeated work — if all test cases resulted in writing the same helper, bundle that script

## Description Optimization

The description field is the primary trigger. After creating a skill:
1. Create eval queries (mix of should-trigger and should-not-trigger)
2. Review with user
3. Test description against eval set
4. Iterate: propose improvements, re-test, repeat
5. Apply best scoring description

## Skill Organization

Skills live in `.agents/skills/`. Project-specific skills are stored in `skills/` at project root and symlinked into `.agents/skills/` by `init.js`.
