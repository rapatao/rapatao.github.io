---
title: "Build tests using Kotlin, JUnit and MockK"
date: 2022-01-19T22:00:00-03:00
tags:
    - kotlin
    - junit
    - mockk
    - tests
images: 
  - src: "/images/posts/pexels-pixabay-163016.jpg"
    alt: "Build tests using Kotlin, JUnit and MockK"
url: "/posts/2022-01/build-tests-using-kotlin-junit-mockk/"
---

The main objective of building code tests in an application is to certify what was coded, that is, to guarantee that a given piece of code does what it should do.

[JUnit](https://junit.org/junit5/) is one of the most used frameworks for building tests in [Kotlin](https://kotlinlang.org/) and [MockK](https://mockk. io/) to build *mocks*, which would be like doubles of an object and have the function of simulating the behavior of a component.

<aside>
💡 The codes used in this text are available on GitHub: https://github.com/rapatao/blog-koltin-junit-mockk
</aside>

## Dependências utilizadas

It is important to say that there are several ways to add support to the language and frameworks that we will use in this text. In the example below, only one of them will be presented, being basically how *[IntelliJ IDEA](https://www.jetbrains.com/idea/)* initializes projects in *Kotlin* + *[Gradle](https:// gradle.org/)*.

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "1.6.10"
}
...
dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
    testImplementation("org.junit.jupiter:junit-jupiter:5.8.2")
    testImplementation("io.mockk:mockk:1.12.2")
}
...
test {
    useJUnitPlatform()
}
```

Before adding these settings to your project, it is always important to verify that they are not already present in your project. This can be done through the *task* `:dependencies`, either through an IDE or through a terminal, with the following command:

```bash
$ gradle dependencies
```

With the output of the command, just look for the dependencies, if you find them, your configuration is correct.

## The code to be tested

As the main idea is to demonstrate the construction of tests using *Kotlin*, *JUnit* and *MockK*, the code used is extremely simple, but through it it will be possible to demonstrate not only the creation of tests using *JUnit*, but also the construction *mocks* through *MockK*, among other details that we will detail throughout the text.

***CalculatorService.kt***

```kotlin
class CalculatorService {
    fun sum(a: Int, b: Int) = a + b
    fun multi(a: Int, b: Int) = a * b
}
```

***OpType.kt***

```kotlin
enum class OpType {
    SUM, MULTI
}
```

***MainService.kt***

```kotlin
class MainService(
    private val calculatorService: CalculatorService
) {
    fun execute(a: Int, b: Int, op: OpType) =
        when (op) {
            OpType.SUM -> calculatorService.sum(a, b)
            OpType.MULTI -> calculatorService.multi(a, b)
        }
}
```

## The first test

The declaration of tests with *JUnit* is done through the annotation `org.junit.jupiter.api.Test` added to a function that describes the scenario to be executed, as in the example:

```kotlin
import org.junit.jupiter.api.Test

internal class ClassTest {

    @Test
    fun test() {
        // test block
    }

}
```

In general, every test verifies that something went as expected. There are several ways to do this, but they are usually done through the existing methods in the `org.junit.jupiter.api.Assertions` class, such as `assertEquals`. Other methods exist, and can be checked [here](https://junit.org/junit5/docs/current/api/org.junit.jupiter.api/org/junit/jupiter/api/Assertions.html).

Based on the code presented above, we can create some test scenarios, but I will describe only two, which will basically perform simple tests with the `SUM` and `MULTI` operations.

```kotlin
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class SimpleTest {

    @Test
    fun `o resultado de 2+3 deve ser 5`() {
        val calculatorService = CalculatorService()
        val mainService = MainService(calculatorService)

        val result = mainService.execute(2, 3, OpType.SUM)

        assertEquals(5, result)
    }

    @Test
    fun `o resultado de 2*3 deve ser 6`() {
        val calculatorService = CalculatorService()
        val mainService = MainService(calculatorService)

        val result = mainService.execute(2, 3, OpType.MULTI)

        assertEquals(6, result)
    }

}
```

Despite being simple, these tests demonstrate how the construction of tests is carried out, which basically consists of creating the necessary instances, invoking the function to be tested and comparing its result.

## Reducing duplicate code in tests

As can be seen, both scenarios perform the construction of an instance of the class to be tested and, consequently, of its dependencies. With *JUnit*, such cases could be constructed by declaring a specific annotation function, which is executed before or after one or all of the declared test scenarios.

These annotations are used when we need to prepare or remove data before or after the execution of test scenarios, such as, for example, inserting data into a database, or deleting information inserted in this same database.

Existing annotations and their behavior are described below:

- `org.junit.jupiter.api.BeforeAll`: Runs **before** **all** test scenarios
- `org.junit.jupiter.api.AfterEach`: Runs **before** **each** test scenario
- `org.junit.jupiter.api.AfterEach`: Run **after** **each** test scenario
- `org.junit.jupiter.api.AfterAll`: Run **after** **all** test scenarios

Knowing these annotations, we can rewrite the previous scenarios as follows:

```kotlin
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

internal class WithBeforeTest {

    private lateinit var calculatorService: CalculatorService
    private lateinit var mainService: MainService

    @BeforeEach
    fun setup() {
        calculatorService = CalculatorService()
        mainService = MainService(calculatorService)
    }
    ...
}
```

## Simulating calls on other classes

Many tests can be built using "real" dependencies, that is, with their instances, however, in some cases this may not be possible, since these instances may need or access resources that are not available during the execution of the tests.

In these cases, we use tools that create *mocks*, which can be understood as instances that simulate the behavior of a real instance. This simulation is normally declared explicitly and would be something like: "when method A is invoked with certain parameters, B should be returned".

Using our example classes, we can write the tests as follows:

```kotlin
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

internal class WithBeforeTest {

    private lateinit var calculatorService: CalculatorService
    private lateinit var mainService: MainService

    @BeforeEach
    fun setup() {
        calculatorService = mockk()
        mainService = MainService(calculatorService)
    }

    @Test
    fun `o resultado de 2+3 deve ser 5`() {
        every { calculatorService.sum(any(), any()) } returns 5

        val result = mainService.execute(2, 3, OpType.SUM)

        Assertions.assertEquals(5, result)
    }

    @Test
    fun `o resultado de 2*3 deve ser 6`() {
        every { calculatorService.multi(any(), any()) } returns 6

        val result = mainService.execute(2, 3, OpType.MULTI)

        Assertions.assertEquals(6, result)
    }
}
```

Note that now, before invoking the `execute` method, we say how *mock* should behave when consumed. Although it doesn't make much sense in our example, considering the simplicity of our code, this can be extremely useful when we need to simulate the use of a third party *SDK* that doesn't provide the means to create tests, which could make it impossible to create tests , if not used *mocks.*

## Creating mocks with annotations

The *MockK* framework provides a set of annotations that can be used to create *mocks* and inject them into the class to be tested, without this process being explicitly performed. This feature is useful when we need to create several *mocks* to build the tests and its construction is done by adding `io.mockk.impl.annotations.MockK` and `io.mockk.impl.annotations.InjectMockKs` annotations to the variables. declared in the test class.

After that, we must change the `setup` method to initialize these variables, as we can see below:

```kotlin
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

internal class WithMockKAnnotationTest {

    @MockK
    private lateinit var calculatorService: CalculatorService

    @InjectMockKs
    private lateinit var mainService: MainService

    @BeforeEach
    fun setup() {
        MockKAnnotations.init(this)
    }
    ...
}
```

## Reducing code when creating mocks

JUnit offers an interesting feature called *[Extensions](https://junit.org/junit5/docs/current/user-guide/#extensions)*. With this feature, we can extend the behavior of the test framework, delegating various behaviors that may be necessary for the execution of test scenarios.

Popular frameworks like *Spring*, via `@SpringBootTest` and *Micronaut*, with `@MicronautTest` make use of this feature to initialize the context before running scenarios.

The *MockK* framework also supports this feature, however, not using a specific annotation, but by an explicit declaration of the JUnit feature, which consists of adding the following annotation to the tests class:

```kotlin
@org.junit.jupiter.api.extension.ExtendWith(MockKExtension::class)
```

With its use, we no longer need, in our test class, we no longer need to declare the `setup` method, leaving our test class as follows:

```kotlin
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(MockKExtension::class)
internal class WithMockKExtensionTest {

    @MockK
    private lateinit var calculatorService: CalculatorService

    @InjectMockKs
    private lateinit var mainService: MainService

    ...
}
```

## Conclusion

In this text we discuss the dependencies necessary for building tests with Kotlin, using JUnit and MockK tools. We also describe how to build methods, executed before and after test cases, as well as creating *mocks* for cases where we cannot use a real implementation.

I hope it helped you understand how to build tests using these tools, as well as how to optimize their construction, demonstrating how to reduce the amount of code needed to build test cases.

Thanks for reading and feel free to ask questions about it.