---
title: "Decoupling Logic with Ruleset Engine: A Lightweight Approach for the JVM"
date: 2026-05-23T10:00:00Z
tags: [kotlin, java, architecture]
images: ["/images/posts/pexels-energepiccom-313690.jpg"]
url: "/posts/2026-05/decoupling-logic-with-ruleset-engine/"
---

It started with a simple request: *"If the user is a premium member, give them free shipping".* We added a quick `if` statement, and everything was fine. A month later, it became: *"If they are premium OR have over 500 points, but only if they are in the US".* Then came the real complexity: active status checks, tag-based exclusions, order minimums, and loyalty requirements.

Before we knew it, our core business logic was buried under a mountain of nested `if/else` blocks. What was once a clean codebase had turned into a "rules nightmare"—hard to read, impossible to test, and terrifying to change. We've all been there, staring at a 50-line conditional block, wondering where it all went wrong.

This is the story of how we stopped hardcoding logic and started using **Ruleset Engine**.

## The Breaking Point

The problem with hardcoded rules isn't just the "spaghetti code". It's the lack of agility. Every time a business analyst wanted to tweak an eligibility requirement, we had to go through a full development cycle: code, test, review, and deploy. We were the bottleneck.

We needed a way to decouple the *what* (the business rules) from the *how* (the application code). We needed something lightweight, flexible, and JVM-native.

## Enter Ruleset Engine

[Ruleset Engine](https://github.com/rapatao/ruleset-engine) was designed for exactly this scenario. It allows you to externalize your logic into data (like JSON) or define it using a fluent Kotlin DSL that even a non-developer can almost understand.

### Step 1: Speaking the Language

Instead of writing complex conditionals, we started building rules. Using the Kotlin DSL, our eligibility logic began to look like this:

#### Before: The Usual if/else

```kotlin
val isEligible = user != null 
    && (user.isPremium || (user.points != null && user.points > 500 && user.location == "US")) 
    && user.active 
    && user.tags?.contains("blocked") == false
    && (order != null && (order.total > 100 || user.yearsOfLoyalty >= 2))

if (isEligible) {
    applyDiscount()
}
```

While manageable with a few lines, imagine adding five more conditions or nested "OR" blocks. It quickly becomes a readability nightmare that is prone to logic errors—especially when you have to manually handle every potential null pointer.

#### After: The Ruleset Engine DSL

```kotlin
import com.rapatao.projects.ruleset.engine.types.builder.*

val eligibilityRule = allMatch(
    anyMatch(
        "user.isPremium" equalsTo true,
        allMatch(
            "user.points" greaterThan 500,
            "user.location" equalsTo "US"
        )
    ),
    "user.active" equalsTo true ifFail OnFailure.FALSE,
    "user.tags" notContains "blocked",
    "user.middleName" equalsTo null, // Explicitly checking for null
    anyMatch(
        "order.total" greaterThan 100,
        "user.yearsOfLoyalty" greaterOrEqualThan 2
    ) ifFail OnFailure.FALSE
)
```

> **Note on Resilience:** Notice that `ifFail` is placed on the `anyMatch` block itself. This replicates the native short-circuiting behavior: if `order` is null, evaluating `"order.total"` fails, causing the entire group to return `FALSE`—exactly like `order != null && (...)`. If we had placed `ifFail` only on the total expression, the engine would have continued to check the loyalty points even if the order was missing!

At first glance, it might look more verbose than a single line of boolean logic. However, this structured approach is significantly easier to read and maintain as the rules grow. It provides a clear, hierarchical view of the business requirements, making it much more accessible for non-developers—like business analysts or product owners—to understand and verify the logic without needing to parse complex code.

It wasn't just code anymore; it was documentation.

## Handling the Unexpected: Resilience by Design

In the real world, data is rarely perfect. A missing field or a null pointer in your input data can easily crash a traditional `if/else` block. 

Ruleset Engine provides a robust way to handle these failures through the `OnFailure` strategy. You can define exactly how an expression should behave when an evaluation fails:
- **`THROW` (Default)**: Re-throws the exception, ensuring you don't miss any critical errors.
- **`TRUE`**: Swallows the failure and treats the expression as `true`.
- **`FALSE`**: Swallows the failure and treats the expression as `false`.

This allows you to build resilient rules that can handle imperfect data without crashing your application. It’s particularly powerful for **deep null-checks**: where a native `if` would require `order != null && order.total > 100`, the engine allows you to simply define the path and handle the failure gracefully.

Using the `ifFail` extension, it’s as simple as:

```kotlin
import com.rapatao.projects.ruleset.engine.types.OnFailure
import com.rapatao.projects.ruleset.engine.types.builder.extensions.ifFail

// If the field is missing, treat the rule as false instead of throwing a NullPointerException
val rule = "user.optional.age" greaterThan 18 ifFail OnFailure.FALSE
```

### Step 2: Evaluating the Truth

Evaluating these rules became a breeze. We could pass in a Map, a POJO, or even a complex Data Class, and the engine would tell us the truth:

```kotlin
val evaluator = KotlinEvaluator()
val context = mapOf("user" to currentUser)

if (evaluator.evaluate(shippingRule, context)) {
    applyFreeShipping()
}
```

### Step 3: Moving to the Cloud (or just a JSON)

The real "magic"—and where the real power of this approach lies—happened when we moved these rules out of the code entirely. Because Ruleset Engine supports Jackson, we could store these rules in our database or a configuration service as JSON:

```json
{
  "allMatch": [
    {
      "anyMatch": [
        { "left": "user.isPremium", "operator": "equals", "right": true },
        {
          "allMatch": [
            { "left": "user.points", "operator": "greater_than", "right": 500 },
            { "left": "user.location", "operator": "equals", "right": "US" }
          ]
        }
      ]
    },
    { "left": "user.active", "operator": "equals", "right": true, "onFailure": "FALSE" },
    { "left": "user.tags", "operator": "not_contains", "right": "blocked" },
    { "left": "user.middleName", "operator": "equals", "right": null },
    {
      "anyMatch": [
        { "left": "order.total", "operator": "greater_than", "right": 100 },
        { "left": "user.yearsOfLoyalty", "operator": "greater_or_equal_than", "right": 2 }
      ],
      "onFailure": "FALSE"
    }
  ]
}
```

By externalizing the rules from the code, we unlocked a new level of agility. Suddenly, the product team could change the validation logic or update business rules on the fly without needing a new code version or a full redeployment. This made responding to market changes easier and significantly faster. Changing a rule was no longer a dev task; it was a configuration update.

## The Result: Agility Regained

By adopting Ruleset Engine, we didn't just clean up our code. We changed the way we work. We moved from being the "gatekeepers of logic" to the "builders of the platform". The business could iterate faster, and we could sleep better knowing that our core logic was no longer a house of cards.

If your project is starting to feel the weight of its own "if" statements, it might be time to tell a different story with Ruleset Engine.

> **Note:** This post was written using version 1.6.0 of the Ruleset Engine.

## References
- [Ruleset Engine GitHub Repository](https://github.com/rapatao/ruleset-engine)
- [Official Documentation](https://github.com/rapatao/ruleset-engine#usage)
