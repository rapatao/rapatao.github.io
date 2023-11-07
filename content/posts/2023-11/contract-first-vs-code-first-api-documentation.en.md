---
title: "Destructuring in Kotlin"
date: 2023-11-07T09:00:00Z
tags:
  - kotlin
images:
  - src: "/images/posts/pexels-cottonbro-studio-3944307.jpg"
    alt: "Destructuring in Kotlin"
url: "/posts/2023-11/destructuring-in-kotlin/"
---

`Destructuring` is a programming concept that entails breaking down a complex data structure into its individual components and assigning these components to individual variables directly in a single statement.

As many other modern languages support it, but `Kotlin`, at least when compared to `JavaScript`, has a different behavior when used on data classes.

The purpose of this text is to talk about this difference, and how to prevent, as earlier as possible, mistakes that its usage could cause to your code. 

## Understanding Destructuring Declarations

Destructuring allows you to decompose an object into a set of variables. For example:

```kotlin
data class Item(val name: String, val price: Double)

val rice = User("Rice", 2.13)
val (name, price) = rice
```

In this code, a new `Item` instance was created and destructured into two variables that represent its attributes.

It was achieved by using the following statement:

```kotlin
val (name, price) = rice
```

In this case, a `data class` was used, but it is also possible to use it in other data structures, like Arrays and Lists.

```kotlin
val list = listOf("element 1", "element 2")
val (l1, l2) = list

val array = arrayOf("element 1", "element 2", "element 3")
val (a1, a2) = array
```

As it was possible to notice on the `array` example, it isn't mandatory to have all elements assigned to variables. Non-mapped values are simply ignored. 

> Important: mapping more elements than existing on the list will throw the `java.lang.ArrayIndexOutOfBoundsException`

## The Order Matters

The most significant difference between `destructuring` in `Kotlin`, when compared to `JavaScript` is that the ordering of the elements is important.

In `JavaScript`, as it is in `Kotlin`, destructuring a collection is order-based, which means that the first variable declaration will be assigned to the first element of the collection, the second variable to the second element, and so on…

The difference between those two languages is on destructuring objects, where in `JavaScript`, it extracts the properties from the object using its declared name and `Kotlin` extracts based on the declaration order.

In `JavaScript`, by having the following object:

```javascript
let rice = {name: "Rice", price: 2.13};
```

It is possible to destruct it by using both statement, and both of them will always have the same result:

```javascript
let {name, price} = rice; // name = "Rice", price = 2.13
let {price, name} = rice; // price = 2.13, name = "Rice"
```

In `Kotlin`, by having the `Rice` object:

```kotlin
data class Item(val name: String, val price: Double)
val rice = User("Rice", 2.13)
```

The declaration order matters when destructuring it:

```kotlin
val (name, price) = rice // name = "Rice", price = 2.13
val (price, name) = rice // price = "Rice", name = 2.13
```

As you can see, the order in which each attribute of the `Item` is declared directly impacts its assignation when destructuring it.

## Type Enforcement

As you can imagine, this can cause some unwanted behavior on your application by using it, and you could be thinking if it is possible to change its behavior, and the answer is: `no`.

Although it isn't possible to change, understanding this behavior can help you prevent issues related to it, by having test cases that explicitly cover mistakenly changes related to the used fields and also, when possible, enforcing the data type.

Enforcing data type, makes changes like this noticeable at compilation time.

By changing the attribution shown earlier in this text, you can have a compilation error if the used data class has its field ordering changed.

```kotlin
val (name: String, price: Double) = rice // name = "Rice", price = 2.13
```

So, if someone changes the `Item` to have the `price` attribute declared first, the typing will not match, and the compilation will not succeed.

As you can imagine, it didn't prevent all cases because if these two fields have the same data type, the compilation will succeed, since they still match. For cases like this, having good test cases is the only effective solution.

Enforcing data type only brings to your code another validation, which can be useful and, usually, easier to identify the exact part of the code that got impacted by a change.

## Using Destructuring Declarations Wisely

While destructuring declarations can make code more brief and expressive, avoid overusing them. Overuse can make the code harder to understand, especially for those not familiar with the feature.

Always prioritize readability and maintainability, and remember, just because you can, doesn't always mean you should.

In conclusion, Kotlin's destructuring declarations are a great tool to simplify your code and make it more expressive when used judiciously. They provide a way to destructure an object into several variables, making the code more concise and readable. However, like all tools, they should be used appropriately and with an understanding of their underlying mechanics.