---
title: "Optimizing tests in Spring Boot applications"
date: 2021-06-24T22:00:00-03:00
tags:
    - spring
    - springboot
    - java
    - tests
images: 
  - src: "/images/posts/spring-boot-test-performance.png"
    alt: "Spring Boot Test Performance"
url: "/posts/2021-06/optimizing-tests-in-spring-boot-applications/"
---

It is extremely common for applications built with Spring Boot to have all their tests annotated with `@SpringBootTest`, but it is rare to find people who know the functionality of this annotation, when it is necessary to use it and its impact on the execution of an application's tests.

You probably thought that this annotation is for building tests, but do you know what it represents, what happens when it is used?

Simply put, this annotation is a simplified way of adding an extension to [JUnit](https://junit.org/junit5/docs/current/user-guide/#extensions) that aims to initialize the Spring context before the scenarios run of declared tests. With its use, before a test class is executed, the application is searched for the class annotated with `@SpringBootApplication` to identify possible customizations, loaded the settings for the test profile (when not overwritten) and only after the context be initialized, we have the method with the scenario executed.

With this in mind, it is interesting to know how to identify the possible impacts that its use can bring to projects.

## The impact of the @SpringBootTest annotation

We can consider this annotation a facilitator for the creation of tests, however, its indiscriminate use can add considerable execution time, since, as described above, several operations are performed before the tests are executed.

When an application has few test scenarios, normally this time will not be noticed, but as applications and application complexities grow, several new test scenarios tend to be included, making the execution time increasingly impactful.

For reference, an application was created with only one component called **that will return a fixed text when the method is consumed. This application can be summarized in the following classes: 

```java
@SpringBootApplication
public class TempApplication {

    public static void main(String[] args) {
        SpringApplication.run(TempApplication.class, args);
    }

}

@Service
public class TempService {

    public String get() {
        return "Nothing";
    }
}
```

Normally, the tests for the `TempService` class would be implemented as follows:

```java
@SpringBootTest
class TempApplicationTests {

    @Autowired
    private TempService service;

    @Test
    void test() {
        assertEquals("Nothing", service.get());
    }
}
```

Like using the `@SpringBootTest` annotation, we have the *Spring* context initialized on each test and this simple scenario runs at `233ms`. This number may seem small, but we are considering only a test class with only one scenario built and we must always remember that real applications tend to have dozens of classes with hundreds of test scenarios, which, theoretically, would make the total time of execution is the multiplication of this quantity.

## How can we optimize tests?

As you can see, the previous test doesn't use any *Spring* resources, we were just using it to provide us with an instance of the `TempService` class, something that we could easily solve. For this specific case, we can simply remove all Spring annotations and instantiate our class manually, where we would have the following test class:

```java
class TempApplicationTests {

    private TempService service = new TempService();

    @Test
    void test() {
        assertEquals("Nothing", service.get());
    }

}
```

With this change, we were able to get the same test coverage, but our test finishes with just `15ms`, representing a runtime 15 times less than when using annotations.

## Conclusion

As we can see, simple scenarios, where we just use Spring to inject our components, we can easily replace the use of test annotations with native Java resources. With this we can drastically reduce the execution time of our tests and when we scale this to real applications, with different scenarios, we can notice a significant drop in the total execution time of the tests.

However, it is important to clarify that this is not a solution that should be applied to all cases, as your application can and probably should have scenarios in which it would be necessary to use the context for the construction and execution of the tests. As an example for these cases, we can mention tests that aim to identify if all dependencies for our classes have been provided, tests of mappings and HTTP requests or even connections to databases.

Anyway, this approach should not be followed for all cases, but it can certainly be applied in several of them and consequently would bring a reduction in the total time of execution of the tests.