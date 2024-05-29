---
title: "What are Flaky Tests and why fix them!"
date: 2022-08-28T12:00:00-03:00
tags:
  - tests
images:
  - "/images/posts/flaky-pipeline.png"
url: "/posts/2022-08/what-are-flaky-tests-and-why-fix-them/"
aliases:
  - "/pt/posts/2022-08/what-are-flaky-tests-and-why-fix-them/"
---

Building tests is surely one of the most difficult and time-consuming tasks for a developer, in addition to usually generating more lines of code than the added functionality. This is due to the various scenarios that need, or should, be verified.

*Flaky Tests*, are basically test cases created to verify a scenario, however, they can randomly present success and failure results, without having undergone any change, neither in the test case nor in the tested code.

Basically, they are those test cases that fail for no reason and, on re-execution, complete successfully.

Several reasons can cause a test case to be inconsistent, let's address some of the main causes I've experienced below.

## When the order of execution matters

![When play order matters](/images/posts/pexels-shy-sol-65562.jpg#floatleft)

It is common to build a class and add methods for the different cases to be tested, however, especially when we access databases or classes that store the state, the execution of a test case can change these persisted data and, consequently, impact the desired result in the next test run.

Perhaps this is one of the easiest cases to solve, where we can just define the order of execution of these test cases, or even perform a cleaning and preparation of the data before the execution of each test case.

In particular, I understand that a test case should not impact another case and I usually tend to use data cleaning and preparation routines before executing each case. However, I understand that in some cases, defining an execution order could greatly reduce the effort required to build test cases.

An example where the order might make sense would be to test a *CRUD*, where you can create a first case where we create the resource, in the second we retrieve it, in the third we would update it and finally we would delete it. As for business rules validation cases, such as performing calculations or other complex checks, I believe that cleaning and preparation routines are the best option, as it simplifies the understanding of the initial state without the need to analyze the previous test case, disregarding , that many times, the previously executed test does not have much relation with the initial state to be tested in the current case.

I don't believe there is a right or wrong, but different approaches. The most important thing is to understand their differences and identify where a solution can best be applied.

## Dates and time zones are always tricky

![Dates and time zones are always tricky](/images/posts/pexels-andrey-grushnikov-707676.jpg#floatright)

If you have a team that works in different locations, with different time zones, or your CI/CD is in a different time zone than yours, there is a high chance that you have already suffered from test problems that validate dates. This problem is also common to happen in leap years or beginnings of month.

There are several ways to solve this problem, but in general, it consists of modifying how the validation of dates is performed, in order to be able to control the "clock", that is, define the current moment and, consequently, have control of validations involving date. .

In Java, for example, when retrieving the current moment, it is common to use the following block:

```java
final Instant now = Instant.now();
```

However, it is possible to control the "clock" by changing to the following code:

```java
final Instant now = Instant.now(clock);
```

With this, in our test cases, we just build a *mock* of `java.time.Clock` to return a specific date, that is, we have control of the "clock" and ensure validation of a specific scenario in the test case , regardless of where in the time zone or day the due case is being executed.

## Synchronization in Async

![Sync in Async](/images/posts/pexels-connor-martin-5526115.jpg#floatleft)

The use of asynchronous methods has increasingly become routine in application development, given that in many cases, some processes could be executed in parallel, without blocking other operations or even user actions.

However, ensuring that an asynchronous method performed some operation as desired is often a difficult task, since, as it executes at another time, we have no control over when it will be performed, which, depending on the computational capacity, can lead to failures by advance checks. For example, an asynchronous method should persist information in the database, however, at the moment we check, this insertion has not yet occurred, resulting in a failure, however, some time later, the information is inserted correctly.

The difficulty in this type of test is to identify the moment to verify that something has happened, since we have no way of controlling when it will occur. There are several ways to try to ensure that processing has completed before performing the checks, the most common is also the way that I believe is the one we should avoid. That is, block the process for a certain time, using, for example, Java's `Thread.sleep(long)`.

The problem with this approach is that, if the processing completes in 1 second, but we define 60 seconds there, the test case will always take the maximum time to complete and when we replicate this approach for all tests, we end up multiplying the time needed for execution of the tests.

I believe that not all the tools that you may be using have support for checking asynchronous processes, and in certain cases, the use of the aforementioned method may be acceptable, but whenever possible, we should opt for optimized approaches that aim not to block the process. for a specific time, but up to a maximum time limit, performing the checks when it is completed in advance.

An example of a tool that supports this type of validation would be *[Mockito](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html#22)* which offers verification using `timeout(long)`, which ends the verification if it occurs within the specified time or fails if it does not.

## End-to-end tests

![End-to-End Tests](/images/posts/pexels-clark-cruz-2911364.jpg#floatright)

As it is a type of test that integrates with other applications/services, it is naturally a *Flaky Test* and we hardly have an ideal solution for these cases, consequently requiring analysis for confirmation.

Precisely because it integrates with other systems, we have several factors involved that can cause a given test case not to have the expected result, which consequently generates a validation failure. A common example in this type of test would be a possible network intermittence or a simple unavailability of the consumed service, which makes the case to be tested not possible, resulting in failure.

As said before, there is not much to do in these cases, building a resilient application, with retries can minimize these problems, however, it is not a guarantee, depending on the cause of the problem. This is exactly why, in these cases, it is always important to analyze the problem to identify if it is something new, that is, due to a code change, or something external that we have no way to control.

Of course, most of these tests could be converted to tests that use tools that would give us control over the scenarios, allowing us to create simulations to test some specific/necessary case. Often, the use of a real database could be replaced by an in-memory database or an integration to a *REST API* could be done for a *mock* created using *[WireMock](https://wiremock.org/)* instead of the "real" *endpoint*.

In general, these tests are very time consuming in execution and require another considerable time of analysis to confirm if it was a problem introduced in the change or some kind of external intermittence. Reducing the amount of this type of test, I believe, is one of the best solutions to minimize the occurrence of unexpected failures.

<aside>
⚠️ Reducing is not removing! The process of reducing these tests normally consists of adapting these cases to the use of *mocks* and in certain cases, their removal, but this should only be done if another existing test is covering this specific case.
</aside>

## Why fix?

![Why fix?](/images/posts/pexels-ann-h-12347774.jpg#floatleft)

Tests have the function of guaranteeing that a desired behavior is actually happening, that is, if something does what it should do and, consequently, if a change has not impacted this behavior, thus generating problems that can directly impact the users of this system. Another benefit that systems with good code coverage brings is for code refactoring, because, as we have good test cases, we can easily identify when some modification has changed the behavior of the application, so the change must be reanalyzed and in extreme cases, discarded.

Understanding the advantages mentioned above, when we have test cases that fail randomly, regardless of whether we have changed something or not, we end up losing this confidence in the test cases, because we are never sure whether or not we create a problem in the application with the change that we make. we did, consequently consuming a lot of analysis time to confirm that the test failed due to the change or some test considered *Flaky*.

Tests consume execution time, when we come across *Flaky Tests*, we end up having to execute the test cases more than once for them to finish successfully and this, depending on the case, can consume a large part of your day, especially when we use CI/CD that blocks the merging of our code, when it doesn't successfully execute all the existing test cases, which consequently generates frustration for the developer.

It is not always easy to identify these cases, but correcting them is important to guarantee confidence in the test cases, bring security in corrections and in the development of new features, in addition to improving productivity, since we have a guarantee that, when our tests fail, it's in fact some new problem that we created and not a burst that, when rerun, disappears.
