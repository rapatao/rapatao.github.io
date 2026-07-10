---
title: "Documenting Decisions with ADRs: Why Your Codebase Needs a Memory"
date: 2026-07-10T10:00:00Z
tags: [adr, architecture, documentation, productivity]
url: "/posts/2026-07/documenting-decisions-with-adrs/"
---

Every codebase has ghosts. That weird retry logic no one dares touch. The database column that must never be nullable. The library you swapped out three years ago for a reason nobody remembers. Someone made a decision, it mattered, and then the reasoning evaporated the moment that person left the team, or simply forgot.

The problem isn't that decisions get made. It's that decisions get made and then lost. Six months later someone asks "why do we do it this way?" and the honest answer is a shrug. That shrug is expensive. It leads to reversing good decisions, re-litigating settled debates, and repeating mistakes that were already paid for once.

Architecture Decision Records, or ADRs, are the cheapest fix I know for this problem.

## What an ADR Actually Is

An ADR is a short document that captures one architecturally significant decision, the context that forced it, and the consequences that follow. That's it. It's not a design doc, not a spec, not a wiki page that rots. It's a small, immutable record of a single choice, written at the moment the choice is made.

The format was popularized by Michael Nygard in 2011, and its power comes from its constraints:

- **One decision per record.** No sprawling documents covering the whole system.
- **Written when the decision is fresh.** Not reconstructed months later from memory.
- **Immutable.** You don't edit a decision, you supersede it with a new one.

That last point is the one people miss. An ADR is a log, not a wiki. It preserves history, including the decisions you later reversed. Knowing that you *tried* something and abandoned it is often more valuable than the current state alone.

## What Counts as "Architecturally Significant"

Not every choice deserves an ADR. You don't record which variable name you picked. The bar is whether the decision is **costly to reverse** or **hard to understand later**.

Good candidates:

- Choosing a database, message broker, or cloud provider.
- Adopting (or rejecting) a framework or major dependency.
- Defining an API contract or a versioning strategy.
- A structural pattern: event sourcing, CQRS, a monolith-vs-microservices split.
- A security or compliance constraint that shapes the design.

Bad candidates: formatting rules, naming conventions, anything already enforced by a linter. If a tool can encode it, a tool should, not a document.

A useful test: *if a new engineer would ask "wait, why is it like this?", it probably deserves an ADR.*

## The Anatomy of an ADR

Keep it small. A good ADR fits on one screen. Here's the structure I use:

```markdown
# ADR-0007: Use PostgreSQL as the primary datastore

## Status
Accepted

## Context
We need a primary datastore for the ordering service. Our data is
highly relational (orders, line items, customers, inventory) with
strong consistency requirements around stock levels. The team has
deep SQL experience. We evaluated MongoDB and DynamoDB.

## Decision
We will use PostgreSQL as the primary datastore.

## Consequences
- We gain ACID transactions, which the inventory logic depends on.
- We take on the operational cost of managing a relational database.
- Horizontal scaling will require deliberate effort (read replicas,
  partitioning) if load grows beyond a single primary.
- Document-shaped data, if it appears, will use the JSONB column type
  rather than a separate store.
```

The four sections carry the whole load:

- **Status.** Proposed, Accepted, Deprecated, or Superseded. This is the state machine of the decision.
- **Context.** The forces at play. What constraints, requirements, and trade-offs led here? This is the most valuable section and the one most often skipped.
- **Decision.** The choice itself, stated plainly and actively: "We will..."
- **Consequences.** What becomes easier, what becomes harder. Honest ADRs list the downsides too. A decision with no listed drawbacks is a decision that wasn't examined.

### The Status Lifecycle

The status field is what makes ADRs a living record rather than a graveyard. A decision moves through states:

```text
Proposed  ->  Accepted  ->  Deprecated
                        ->  Superseded by ADR-0012
```

When a new decision replaces an old one, you don't delete the old ADR. You mark it `Superseded by ADR-0012` and, in the new record, reference what it replaces. The chain of reasoning stays intact. Anyone reading ADR-0007 later sees immediately that the story continued elsewhere.

## Where ADRs Live

My strong preference is to keep them in the repository, next to the code, in version control. You can absolutely put them elsewhere, like a wiki, Confluence, or a docs portal, and for some teams that fits better. But the further they sit from the code, the harder they are to maintain and the easier they are to forget to update or check.

```text
docs/
  adr/
    0001-record-architecture-decisions.md
    0002-use-postgresql-as-primary-datastore.md
    0003-adopt-rest-over-graphql.md
    ...
```

What you gain by keeping them in the repo:

- **They travel with the code.** Clone the repo, get the decisions.
- **They're reviewed like code.** An ADR goes through a pull request. The decision gets discussed *before* it's accepted, in the same tool where the work happens.
- **They version with the code.** You can see which ADRs were in effect at any commit.

A wiki page tends to drift from reality precisely because updating it is a separate step nobody remembers. An ADR in the repo, reviewed in a PR, is part of the same workflow that produces the software, so keeping it current costs almost nothing. Wherever you put them, the goal is the same: make the decision easy to find and hard to forget.

There's also a modern bonus: the same context that helps a new engineer helps an AI coding agent. Point an agent at your `docs/adr/` directory and it stops guessing at why the system is shaped the way it is. It respects the trade-offs you already weighed instead of quietly violating them. If [tests act as executable specifications](/posts/2026-06/tdd-in-the-agent-era/), ADRs act as executable *intent*, and an agent that reads both works inside real guardrails instead of improvising.

## Tooling That Helps

You don't need anything fancy: a Markdown file and a text editor cover the whole workflow. But a few tools remove friction, and less friction means more decisions actually get recorded.

On the command line, [adr-tools](https://github.com/npryce/adr-tools) is a small set of shell commands that scaffold a new record, number it, and manage the superseding links for you. [Log4brains](https://github.com/thomvaill/log4brains) goes further, adding a CLI plus a static site so the ADR log becomes a browsable knowledge base.

Inside the editor, IDE plugins keep the record close to where you work. JetBrains IDEs have an ADR plugin that creates and lists records from the project view, and VS Code has extensions like "ADR Manager" and "adr-tools" wrappers that do the same. The point is the same as putting ADRs in the repo: the less you have to leave your flow, the more likely the decision gets captured.

Then there are AI skills. If you use an AI coding assistant, a small custom skill or prompt can turn a design discussion, a pull request thread, or a spoken decision into a draft ADR in the right format, with context and consequences already filled in. You still review and correct it, the same way you'd review any generated content, but the blank-page cost drops to almost nothing. And since the ADR ends up in `docs/adr/`, the assistant reads it back later as context. The tool that helps you write the record is the same one that benefits from it.

## Getting Started Without Boiling the Ocean

The failure mode for ADRs is treating them as a documentation project. Don't. You don't retroactively write fifty ADRs for a decade of decisions. You start from today.

1. **Write ADR-0001 about using ADRs.** Seriously. The first record documents the decision to keep records. It's a five-minute exercise and it sets the format.
2. **Record the next real decision.** The next time a meaningful architectural choice comes up, write it down before you close the ticket.
3. **Backfill only what's actively contested.** If a decision keeps getting questioned, write the ADR that ends the debate. Ignore the rest.

Within a few months you'll have a record of every significant choice made since you started, which is exactly the window that matters, because those are the decisions still fresh enough to question.

## Common Pitfalls

**Writing them too late.** An ADR reconstructed from memory months later is fiction. The context, the alternatives you weighed, the constraints that mattered, is exactly what fades first. Write it while the decision is warm.

**Editing decisions instead of superseding them.** If you rewrite ADR-0003 to reflect a new choice, you've destroyed the history. Supersede it. The old reasoning is data.

**Making them too big.** An ADR covering "our entire microservices strategy" is not an ADR, it's a design doc wearing a costume. One decision per record. If you can't state the decision in a sentence, it's more than one decision.

**Skipping the consequences.** The context and consequences are where the value lives. A record that only says "we chose X" without saying *why* and *at what cost* is a headline with no article.

## Conclusion

Code tells you *what* the system does. Tests tell you what it's *supposed* to do. Neither tells you *why* it's built the way it is, and that "why" is the first thing to disappear and the most expensive thing to reconstruct.

ADRs are a memory for your architecture. They're cheap to write, they live next to the code, and they survive turnover. The best time to start was when the project began. The second best time is the next decision you make.

Write it down. Your future team will thank you.

## References

- [Developing Code in the Era of Agents](/posts/2026-05/developing-code-in-the-era-of-agents/)
- [TDD in the Agent Era](/posts/2026-06/tdd-in-the-agent-era/)
- [Michael Nygard: Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [adr.github.io: ADR organization and tooling](https://adr.github.io/)
- [Joel Parker Henderson: Architecture Decision Record collection](https://github.com/joelparkerhenderson/architecture-decision-record)
