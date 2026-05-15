# Domain Context

Domain terminology, relationships, and decisions discovered through `grill-with-docs` sessions. Read this file before making any architectural decision.

## Usage

This file is the canonical store for the project's domain language. When new terms or concepts are resolved during a `grill-with-docs` session, update this file immediately — do not batch.

The agent MUST use `grill-with-docs` methodology when maintaining this file:
- **Challenge against the glossary:** When a term conflicts with existing language, call it out immediately.
- **Sharpen fuzzy language:** Propose precise canonical terms. List ambiguous alternatives under "Avoid."
- **Discuss concrete scenarios:** Stress-test domain relationships with specific scenarios that probe edge cases.
- **Cross-reference with code:** When a stated relationship contradicts the codebase, surface it.

Only include terms specific to this project's domain. General programming concepts (timeouts, error types, utility patterns) do not belong here.

---

## Language

<!-- Populated by grill-with-docs. Define terms: one sentence max. What it IS, not what it does. -->

**Term Name**:
Concise definition of the concept.
_Avoid_: Alternative names to avoid

## Relationships

<!-- Populated by grill-with-docs. Show domain relationships with cardinality. -->

- A **TermA** produces one or more **TermBs**
- A **TermB** belongs to exactly one **TermC**

## Example dialogue

<!-- Populated by grill-with-docs. Demonstrate how terms interact naturally in conversation. -->

> **Dev:** "Question using domain terms?"
> **Domain expert:** "Answer clarifying boundaries between concepts."

## Flagged ambiguities

<!-- Populated by grill-with-docs. Record when terms were used ambiguously and how they were resolved. -->

- "ambiguous term" was used to mean both **ConceptA** and **ConceptB** — resolved: these are distinct concepts.
