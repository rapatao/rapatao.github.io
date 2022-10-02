---
title: "Verify vararg methods using Mockito"
date: 2020-05-14T00:00:00-03:00
tags:
    - java
    - mockito
    - junit
    - tests
images: 
  - src: "/images/posts/pexels-christina-morillo-1181244.jpg"
    alt: "java code"
    stretch: "vertical"
url: "/posts/2020-05/verify-varargs-using-mockito/"    
---

Building tests is one of the most routine tasks for a developer and normally, with frameworks like jUnit and Mockito, this task tends to be carried out without great difficulties. Despite this, there are certain validations, which tend to be more complex, such as checking calls to methods with parameters of type *varargs*.

If you don't know what *varargs* is, you can roughly say that it is, the "..." used in parameter declarations in methods, however, I recommend reading [this article](https://www.geeksforgeeks.org/variable-arguments-varargs-in-java/) for better understanding and viewing examples.

Despite not being highly complex, we do not always have control over how implementations will be invoked, especially when we use frameworks that make use of concepts such as *callbacks* or even *reflection*, widely used in the Spring framework.

Consider the following class declaration:

```java
class Varargs {

    public void consume(String... values) {
        System.out.println(String.join(", ", values));
    }

}
```

We must consider that the *Varargs* class will be invoked by some *framework* over which we have no control, however, we need to ensure that, knowing the input value, the values ​​to be received in the implementation will also be known.

To try to exemplify a scenario, we can consider that the framework will convert values ​​from the consumption response of a *REST API*, perform calculations and consume the implementation with the result of this operation.

Although we cannot control the operations performed by this framework, we can manipulate the execution, sending known values ​​and validating if the implementation's consumption will be done as expected.

`This type of test is very useful to guarantee that updates of this framework, do not compromise the behavior of our application, allowing constant and safe updates.`

Imagining that the framework in use has a class that we cannot control, exemplified below by the *Invoker* class with *final* modifier, we must ensure that after the operation, when the method of the *Varargs* class is invoked, the same arguments are always received, based on the input parameters.

```java
final class Invoker {

    private final Varargs varargs;

    public Invoker(Varargs varargs) {
        this.varargs = varargs;
    }

    public void invoke(String... values) {
        final var newValue = new ArrayList<>(Arrays.asList(values));
        newValue.add(0, String.valueOf(values.length));
        varargs.consume(newValue.toArray(new String[0]));
    }

}
```

Considering everything that was said above, here are some examples of using our implementation by the *Invoker* class:

```java
final var varargs = new Varargs();
final var invoker = new Invoker(varargs);

invoker.invoke();
// 0
invoker.invoke("1");
// 1, 1
invoker.invoke("1", "2");
// 2, 1, 2
```

Given the context, the following is a test implementation for scenario validation:

```java
@Test
public void testNoArgument() {
    final var varargs = Mockito.spy(new Varargs());

    new Invoker(varargs).invoke();

    final var stringArgumentCaptor = ArgumentCaptor.forClass(String.class);
    verify(varargs).consume(stringArgumentCaptor.capture());

    assertThat(stringArgumentCaptor.getAllValues(), hasSize(1));
    assertThat(stringArgumentCaptor.getAllValues(), containsInRelativeOrder("0"));
}

@Test
public void testSingleArgument() {
    final var varargs = Mockito.spy(new Varargs());

    new Invoker(varargs).invoke("1");

    final var stringArgumentCaptor = ArgumentCaptor.forClass(String.class);
    verify(varargs).consume(stringArgumentCaptor.capture());

    assertThat(stringArgumentCaptor.getAllValues(), hasSize(2));
    assertThat(stringArgumentCaptor.getAllValues(), containsInRelativeOrder("1", "1"));
}

@Test
public void testTwoArguments() {
    final var varargs = Mockito.spy(new Varargs());

    new Invoker(varargs).invoke("1", "2");

    final var stringArgumentCaptor = ArgumentCaptor.forClass(String.class);
    verify(varargs).consume(stringArgumentCaptor.capture());

    assertThat(stringArgumentCaptor.getAllValues(), hasSize(3));
    assertThat(stringArgumentCaptor.getAllValues(), containsInRelativeOrder("2", "1", "2"));
}
```

This way we can guarantee that when *Invoker* receives certain input parameters, *Varargs* will always be consumed with the same values.

Although the example here is not from a real scenario, I believe that it can be easily adapted to various cases, thus serving as a reference.

If you have any questions or suggestions, don't hesitate to get in touch!
