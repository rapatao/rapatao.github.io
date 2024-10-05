---
title: "Fixing memory issues while running tests on Spring Boot using Kafka"
date: 2024-10-05T20:00:00Z
tags:
  - tests
  - spring
  - testcontainers
  - kafka
images:
  - "/images/posts/pexels-bentonphotocinema-1095601.jpg"
url: "/posts/2024-10/fixing-memory-issues-while-running-tests-on-spring-boot-using-kafka/"
---

Recently, I faced a problem in an application where it was taking too long to run its tests. After checking the reasons,
I found out that the embedded Kafka provided by Spring was consuming too much memory, making it hard for the GC to free
up space to allow all the remaining tests to execute.

That embedded solution worked fine at the beginning of the project, where a few test cases really needed to use that
resource to validate its use cases. As soon as the project gets bigger and more test cases are required to use that
resource, an issue with the testing execution starts to show up, and the test execution time is drastically starting to
increase.

![please sir, can I have some more memory?](/images/posts/please-sir-can-i-have-some-more-memory.png#center)

Ok, the issue was identified, so how can it be fixed? Initially, I thought, let's increase the memory allocated to run
those tests, and it should resolve the issue! But how much memory should I add? Will it be future-proof? More tests will
be added soon, and will that issue occur again?

After thinking about it for a while, I remembered that I use `testcontainers` on other applications and also on my
Golang projects, so I decided to give it a try using it on this application.

## Adding testcontainers to the project

As usual, I went to the official documentation to read about that integration, and then I sadly discovered that, to use
it, a considerable change would be required.

To use the embedded solution, only an annotation is required, but now, it will require not only an annotation, but also
some lines of code to allow overriding the default Kafka bootstrap URLs present in the Spring context.

To give context to it, each testing class that requires Kafka adds a single annotation describing the topic used in the
test.

```kotlin
@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = ["topic-name"])
public class CasesTests {
    // testing code
}
```

The next step is replacing it with the `testcontainers` implementation; each test class must now have the following
code, which didn't include the topic creation that was essential in most of the use cases.

```kotlin

@SpringBootTest
@Testcontainers
public class CasesTests {

    companion object {
        @Container
        val kafka = KafkaContainer(
            DockerImageName.parse("apache/kafka:latest")
        );

        @DynamicPropertySource
        @JvmStatic
        fun overrideProperties(registry: DynamicPropertyRegistryy) {
            registry.add("spring.kafka.bootstrap-servers", kafka.bootstrapServers);
        }
    }
    // testing code
}
```

Although it didn't seem like much code and could probably be shared between the test classes by composing the companion
object, it still has the problem of creating the topic required in each test case.

You may be starting to ask how to address all those “issues”, right? Keep reading, and you will get the answer.

## Let's use JUnit instead

In [this post]({{% ref "/posts/2022/01/construindo-testes-com-kotlin-junit-mockk" %}}), I mentioned that JUnit has some
useful annotations that allow us to run operations before or after our test cases. Those are the annotations:

- `@BeforeEach`: execute before each method
- `@BeforeAll`: execute before all test methods
- `@AfterEach`: execute after each method
- `@AfterAll`: execute after all test methods

At this point, you are probably thinking that these annotations could be used to create the topics, and you are correct!
By using it before running the test cases, the required topics could be created, but it still requires adding many
instructions to the existing classes, and I would rather not do it.

So, it comes to mind implementing a custom JUnit callback that will read the metadata defined on an annotation to handle
all of it. Sounds great, right? Let's start coding.

First, I created the following annotation:

```kotlin
annotation class EnableKafkaTopics(
    val partitions: Int = 1,
    vararg val topics: String = [],
)
```

As you could see, it has basically the same signature as the `@EmbeddedKafka` one, which would allow me to only replace
the annotation and still have everything working as before.

Now that the annotation is defined, let's create the JUnit extension to read that and create the topics.

```kotlin
class KafkaTopicsExtension : BeforeEachCallback {
    override fun beforeEach(context: ExtensionContext) {
        // find the annotation from the testing class
        val definition = TestContextAnnotationUtils.findMergedAnnotation(
            context.testClass.get(),
            EnableKafkaTopics::class.java,
        )!!

        // define the topic creation using the annotation metadata
        val topics = definition.topics.map { NewTopic(it, definition.partitions, 1) }

        // get KafkaAdmin bean from the Spring context
        val kafkaAdmin = SpringExtension.getApplicationContext(context).getBean(KafkaAdmin::class.java)

        // create topics
        kafkaAdmin.createOrModifyTopics(*topics.toTypedArray())
    }
}
```

With the extension implemented, I changed the `EnableKafkaTopics` annotation to refer to the desired extension.

```kotlin
@ExtendWith(KafkaTopicsExtension::class)
annotation class EnableKafkaTopics(
    val partitions: Int = 1,
    vararg val topics: String = [],
)
```

At this point, I completely forgot that I should append to the test class the companion object to start the container
and just went to the code and replaced it within my new `EnableKafkaTopics` annotation.

As you could imagine, the test failed because no container started, no topic was created, and consequently, the test
case failed.

So, there I go. Since changing it on all classes just for testing would be harder, I opened a single test class, added
the companion object declaration to start the container, and _voilà_, all tests on it passed.

After all this work, I was happy that it worked but wished to make it easier to replace the embedded solution with this
new one and, somehow, make it future-proof, simplifying its usage on newer test classes.

## Spring Context Customizers is the solution

That was what I thought at the time, so I ended by creating a customizer that initializes the container and replaces the
bootstrap address in the Spring context.

The following code does exactly that:

```kotlin
class KafkaContainerContextCustomizerFactory : ContextCustomizerFactory {
    override fun createContextCustomizer(
        testClass: Class<*>,
        configAttributes: MutableList<ContextConfigurationAttributes>
    ): ContextCustomizer? {
        // try to find the annotation from the test running class, otherwise, return null without initializing the container
        if (TestContextAnnotationUtils.findMergedAnnotation(testClass, EnableKafkaTopics::class.java) == null) {
            return null
        }

        // create kafka and start container
        val container = KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:latest"))
        container.start()

        // create and return context customizer
        return KafkaContainerContextCustomizer(container)
    }

    inner class KafkaContainerContextCustomizer(val container: KafkaContainer) : ContextCustomizer {
        override fun customizeContext(
            context: ConfigurableApplicationContext,
            mergedConfig: MergedContextConfiguration
        ) {
            // add the bootstrap servers at the top of the properties
            context.environment.propertySources.addFirst(
                MapPropertySource(
                    "kafka", mapOf("spring.kafka.bootstrap-servers" to container.bootstrapServers),
                ),
            )
        }
    }
}
```

It is necessary to create a `spring.factories` inside the `META-INF` folder to activate this factory. The content of the
file must be something like this:

```
org.springframework.test.context.ContextCustomizerFactory=\
  com.rapatao.www.KafkaContainerContextCustomizerFactory
```

At first glance, I thought that I had found the perfect solution, so I replaced the annotation on all testing cases and
ran the building to ensure that all tests would succeed.

As it started running, most of the tests were being executed successfully, but at some point, they started to fail due
to a lack of memory. I started the investigation because, in my mind, it shouldn't happen until I realized the problem.

I was starting the containers but never stopping them because, I was expecting that the `testcontainers` controller
would stop them automatically, which it actually does, but only when the execution finishes, which in my case, is when
all tests finish.

At this point, I was too tired, so I decided to go simple. Since it was only used for testing, I created a static map to
store the test class and its container instance and extended the `KafkaTopicsExtension` to stop this container after the
test execution.

It worked, but I will not cover these changes in the article because, when I was rewriting the solution to have some
code snippets to add in this text, I ended up finding a better solution.

## Spring Test Configuration

Similar to the `@Configuration` which is normally used to create beans and expose some other kinds of customizations in
the productive code, the `@TestConfiguration` does the same, but it is used in the test code.

Spring Boot has an integration package that allows overriding those variables by simply adding the `@ServiceConnection`
annotation. So, to initialize a Kafka container, all I have to do is add the following code:

```kotlin
class KafkaContainerConfiguration {
    @Bean
    @ServiceConnection // It does all the magic
    fun kafkaContainer(): KafkaContainer {
        return KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:latest"))
    }
}
```

As you probably noticed, the given snippet isn't annotating the class with the `@TestConfiguration` and it was
intentional, so we can decide whether to enable or not the Kafka integration since some of our tests don't require the
Kafka to run and activating them would make them slower.

Since all tests that require the Kafka container are annotated with the `@EnableKafkaTopics`, we can adapt it to import
that configuration, which ends by activating the container when necessary.

The final code for the annotation is:

```kotlin
@Import(KafkaContainerConfiguration::class)
@ExtendWith(KafkaTopicsExtension::class)
annotation class EnableKafkaTopics(
    val partitions: Int = 1,
    vararg val topics: String = [],
)
```

## Conclusion

The issue itself was challenging, something that I've never experienced in my coder life, and I was really joyful
reading the documentation of something that I have not been using for so long and has so many changes.

I forgot some basic stuff that I usually recommend to everyone I talk to, which is to first read about the topic in the
official documentation of the tool that you are using.

In my situation, it would probably make me not create the customizer I created, but instead use the annotation the
Spring Boot testing package provides exactly for this purpose.

In my defense, as if I needed one, I read the `testcontainers` documentation, and there, I didn't find anything about
that annotation that I just discovered when writing this post. This is probably something relatively new, but I will not
find out; there's no reason for it.

Anyway, everything that happened was good; it helped me to relearn topics that I had forgotten and also helped me to
write a text for this site, something that I did for the last time, almost a year ago.

I hope it helped you learn, or at least review, some of the topics presented in this post. It may be a good learning
experience if you have never created a custom JUnit extension or even declared a Spring Customizer Factory.

Thanks for reading it; see you soon.

## References

### Links

* [@EmbeddedKafka Annotation with JUnit5](https://docs.spring.io/spring-kafka/reference/testing.html#embedded-kafka-junit5)
* [Testing Spring Boot Kafka Listener using Testcontainers](https://testcontainers.com/guides/testing-spring-boot-kafka-listener-using-testcontainers/)
* [Context Configuration with Context Initializers](https://docs.spring.io/spring-framework/reference/testing/testcontext-framework/ctx-management/initializers.html)
* [Annotation Interface TestConfiguration](https://docs.spring.io/spring-boot/api/java/org/springframework/boot/test/context/TestConfiguration.html)

### Gradle plugins and dependencies

```gradle
plugins {
    id 'org.jetbrains.kotlin.jvm' version '1.9.25'
    id 'org.jetbrains.kotlin.plugin.spring' version '1.9.25'
    id 'org.springframework.boot' version '3.3.4'
    id 'io.spring.dependency-management' version '1.1.6'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter'
    implementation 'org.jetbrains.kotlin:kotlin-reflect'
    implementation 'org.springframework.kafka:spring-kafka'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.boot:spring-boot-testcontainers'
    testImplementation 'org.testcontainers:junit-jupiter'
    testImplementation 'org.testcontainers:kafka'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}
```
