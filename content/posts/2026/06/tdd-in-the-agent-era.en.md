---
title: "TDD in the Agent Era: Why Test-Driven Development Matters More Than Ever"
date: 2026-06-18T10:00:00Z
tags: [tdd, ai, agents, tests, productivity, architecture]
url: "/posts/2026-06/tdd-in-the-agent-era/"
---

TDD has always been a hard sell. Teammates roll their eyes, deadlines get blamed, and "we'll add tests later" becomes the default. And then AI coding agents arrived — and suddenly the arguments against test-first development look a lot weaker.

There's a tempting trap in the agent era: agents write code fast, so you ship fast, so everything is fine. But speed without direction is just chaos at scale. TDD is the direction.

In my post about [developing code in the era of agents](/posts/2026-05/developing-code-in-the-era-of-agents/), I mentioned TDD as one of the key guardrails for working with AI. This post goes deeper — specifically on how TDD changes the relationship between developer and agent, and why skipping it is riskier now than it ever was before.

## What TDD Actually Is (And What It Isn't)

Test-Driven Development is a discipline, not a testing strategy. The canonical cycle is simple:

1. **Red** — Write a failing test that captures one requirement.
2. **Green** — Write the minimum code to make that test pass.
3. **Refactor** — Clean up the implementation while keeping tests green.

The critical insight is that tests are written *before* the implementation. This isn't about coverage metrics. It's about forcing yourself to think about the problem from the consumer's perspective before thinking about the solution.

TDD is not:
- Writing all tests at the end to hit a coverage target.
- Unit testing in isolation with heavy mocking that doesn't reflect reality.
- A bureaucratic ritual that slows down delivery.

When done right, TDD compresses design time, reduces debugging, and produces code that is naturally modular and readable — because code that's hard to test is code that's hard to use.

## The Agent Problem: Confident and Wrong

AI coding agents are extraordinarily good at generating plausible code. That word — *plausible* — is the danger. An agent doesn't know your domain. It doesn't know that your `processPayment` function should never charge a customer twice under a race condition. It doesn't know that your `calculateDiscount` function must return zero for expired coupons rather than a negative total.

Without a test suite that encodes those requirements, the agent has no guardrails. It will produce code that compiles, looks correct, and fails in production in ways that take hours to diagnose.

A common pattern: an agent writes 200 lines of implementation in 10 seconds, the developer reads it over, it looks reasonable, it gets merged. Two weeks later, a bug report arrives that traces back to an edge case the agent handled incorrectly — because no one ever articulated what "correct" looked like.

TDD forces that articulation *before* the code exists.

## Tests as Specifications: The Shift in Mental Model

The most important reframe for the agent era is this: **tests are not verification — they are specification.**

A test written before implementation isn't checking code; it's defining a contract. Consider this example:

```kotlin
@Test
fun `discount should be zero for expired coupon`() {
    val coupon = Coupon(code = "SAVE10", expiresAt = yesterday())
    val result = calculateDiscount(price = 100.0, coupon = coupon)
    assertEquals(0.0, result)
}

@Test
fun `discount should apply correctly for valid coupon`() {
    val coupon = Coupon(code = "SAVE10", discount = 0.10, expiresAt = tomorrow())
    val result = calculateDiscount(price = 100.0, coupon = coupon)
    assertEquals(10.0, result)
}
```

These two tests say everything about the expected behavior. They define the interface, the inputs, the outputs, and the edge cases. When handed to an agent with a request to write the implementation, there's no guessing involved — this is a machine-readable specification.

The agent becomes a code generator operating within defined constraints. That is a fundamentally different — and far safer — relationship than "write me a discount calculation function."

## The Workflow: TDD with an Agent

This is the workflow that consistently produces better results than letting the agent drive from the start:

### 1. Generate Tests — Then Review Them Deeply

An agent can generate the initial test cases — and this is a legitimate use of the tool. Ask it to enumerate scenarios based on your requirements. The agent will cover the obvious paths quickly.

The critical step, however, is human review. Before any implementation is written, go through every generated test and ask:

- Does this test reflect what the system *should* do, or just what seems natural to generate?
- Are there domain-specific edge cases the agent couldn't know about?
- Do any two tests contradict each other?
- Are there missing scenarios the agent didn't think to cover?

This is the step where domain knowledge earns its keep. The agent produces a draft specification; the developer validates and completes it. Only after this review should implementation begin.

### 2. Ask the Agent to Critique the Tests

Before moving to implementation, turn the agent on the tests themselves: *"Review these tests. Are there cases not covered? Are there requirements these tests imply that seem incomplete or contradictory?"*

Agents can spot gaps, identify ambiguous assertions, and flag cases where two tests encode conflicting behavior. This second pass — agent reviewing agent-generated tests, with human oversight — frequently surfaces issues that a single generation pass misses.

### 3. Let the Agent Implement Against the Tests

Now hand the reviewed tests to the agent and ask for an implementation that makes all of them pass. The agent has constraints. It has a definition of "done." It can't drift into building features that weren't asked for, because the tests tell it exactly what success looks like.

Run the tests. If they fail, feed the failure output back to the agent. The test suite is the feedback loop that keeps the agent on track.

### 4. Refactor Together

Once green, refactor. Ask the agent to suggest improvements — better names, simpler logic, reduced duplication. Because the tests exist, refactoring changes can be accepted confidently. The tests will catch any regression.

## Test Quality Matters Too

A weak test suite is worse than no test suite in this context, because it creates false confidence. If tests only exercise the happy path, an agent will produce an implementation that passes them — and fails on everything else.

Two things matter most for test quality in an agent-assisted workflow:

**Meaningful assertions.** A test that verifies a method was called, but not what it returned, is not a specification — it's a shadow. Prefer asserting outputs and state over asserting interactions.

**Watch out for flaky tests.** An agent that sees intermittent failures will either ignore them or patch around them in unpredictable ways. In my post about [flaky tests and why fixing them matters](/posts/2022-08/what-are-flaky-tests-and-why-fix-them/), I covered how non-deterministic behavior degrades trust in a test suite — in the agent era, that erosion of trust is even more costly because it corrupts the feedback loop that keeps generated code honest.

## Why This Matters for Long-Term Maintainability

The agent era creates a new risk: **velocity without discipline.** Agents make it trivial to generate code, which makes it tempting to skip the thinking that should precede it.

A codebase built without TDD is a codebase where the only documentation of intended behavior is the behavior itself. When that behavior is generated by an agent, you have a system where no one — neither the developer nor the tool — explicitly defined what "correct" means.

TDD builds a living specification. It creates a suite of tests that serves as executable documentation: run it, and you know whether the system behaves as intended. As the codebase grows and agents are asked to modify or extend features, the test suite acts as a safety net. Any regression is caught immediately. The cost of change stays low.

Consider what happens when an agent is asked to refactor a large module six months from now. Without tests, the agent has no way to verify it hasn't broken anything. With tests, the refactoring has an objective success criterion. The agent runs the suite, sees a failure, fixes it, runs again. Confidence comes from evidence, not from reading generated code and hoping for the best.

On the topic of test performance — slow tests discourage the tight red-green-refactor cycle that makes TDD effective. In my post about [optimizing tests in Spring Boot applications](/posts/2021-06/optimizing-tests-in-spring-boot-applications/), I shared techniques that keep the feedback loop fast without sacrificing coverage.

## Objections (And Why They're Wrong in the Agent Era)

**"TDD slows down development."**

Maybe it did when every line of implementation had to be written by hand. In the agent era, the implementation phase is nearly free. The expensive part is figuring out what to build. TDD is exactly that — structured thinking about what to build. The cost has effectively been eliminated from the wrong side of the equation.

**"Agents write tests too, so just ask it to do everything at once."**

Agents that generate tests and implementation simultaneously are grading their own homework. The tests will pass because the agent writes them to match the implementation it already has in mind — not because the implementation is correct. Generating tests first and reviewing them independently breaks that cycle. The result is a specification the agent had no hand in validating.

**"The project moves too fast for TDD."**

Projects that move fast accumulate technical debt fast. Without a test suite, every agent-assisted change is a gamble. The speed gained today is borrowed against the debugging that comes next quarter.

## Conclusion

TDD was always a good idea. In the agent era, it is a necessary one.

Agents are powerful because they can generate vast amounts of code quickly. They are dangerous for the same reason. The test suite is the mechanism that transforms an agent from a source of plausible code into a source of *verified* code.

Generate the tests, review them deeply, let the agent implement, verify, refactor, repeat. This isn't a workflow from the past that happens to still work — it's a discipline that was always pointing toward this moment.

The developers who thrive in the agent era won't be the ones who type the fewest characters. They'll be the ones who think most clearly about what correct behavior looks like before any implementation is generated.

## References

- [Developing Code in the Era of Agents](/posts/2026-05/developing-code-in-the-era-of-agents/)
- [What are Flaky Tests and why fix them](/posts/2022-08/what-are-flaky-tests-and-why-fix-them/)
- [Build tests using Kotlin, JUnit and MockK](/posts/2022-01/build-tests-using-kotlin-junit-mockk/)
- [Optimizing tests in Spring Boot applications](/posts/2021-06/optimizing-tests-in-spring-boot-applications/)
- [Test-Driven Development: By Example — Kent Beck](https://www.oreilly.com/library/view/test-driven-development/0321146530/)
- [Martin Fowler on TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html)