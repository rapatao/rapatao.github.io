---
title: "Thinking in GraalVM? Should I use Quarkus or Micronaut?"
date: 2021-03-24T21:00:00-03:00
tags:
  - quarkus
  - micronaut
  - architecture
images:
  - "/images/posts/quarkus-micronaut.png"
url: "/posts/2021-03/thinking-in-graalvm-should-i-use-quarkus-or-micronaut/"
---

Recently at work, we intended to use *GraalVM* in a new application. Looking for compatible solutions, we saw that *Quarkus* and *Micronaut* looked promising and decided to analyze them.

> Note: When this analysis was performed, *Spring* had very limited support for *GraalVM* and was disregarded.

Among the options mentioned, several *benchmarks* available on the Internet were consulted, in addition to verifying the **compatibility** with tools and libraries normally used in the company's projects. Other factors were analyzed, such as ease and quality of **documentation** and **learning curve** in these technologies. 

## Learning curve

![Learning Curve](/images/posts/pexels-energepiccom-313690.jpg#center)

Despite being often disregarded in analyzes by technology people, the complexity of learning and, in fact, understanding how a technology works greatly affects the quality and productivity of the team on a project. Considering also that we intended to use *GraalVM*, it was extremely prudent to take this topic into consideration, as it would not just be a "new" technology to be implemented in the same project.

The team members also had a good knowledge of *Spring*, which is what is normally used in the developed projects, whether using the traditional *MVC* or the reactive *WebFlux*.

Among the projects that we normally develop, we rarely have a high complexity, in the sense of integration to the *framework*, and we usually only provide a *API Rest* that can consume other *APIs* and one or more databases, that is , our complexity tends to be in the business rules.

Bearing in mind the aforementioned points, both *Quarkus* and *Micronaut* have several similarities with *Spring*, and would facilitate many of our use cases, but as everything is declared in *Micronaut* (*beans*, * configurations*, etc) seemed to be much more similar to *Spring*, which could help in the tool assimilation process.

Another point that also brought some ease with *Micronaut* was the support that it has the declaration of *queries* in a declarative way, similar to the way available in *Spring Data* or *GORM* from *Grails.*

During this review, we confirmed that *Quarkus* tends to follow or prioritize the use of specs, such as *JAX-RS*, for example, tending to not be the norm for those in the *Spring* universe.

## Compatibility

![Compatibility](/images/posts/pexels-castorly-stock-3639031.jpg#center)

As mentioned before, our use cases are rarely very complex, being limited to analysis in the most common scenarios, that is, availability and consumption of a *REST APIs*, as well as access to databases, usually *MySQL*.

The availability of *endpoints*, both tools have similarities, focusing on the fact that *Quarkus* uses by default *JAX-RS* annotations, while *Micronaut*, despite having support for them, uses its own annotations, but these are very intuitive. An important point, and much neglected when we talk about *APIs*, would be their documentation and in this matter, both have native support for *OpenAPI*, allowing a documentation to be generated based on the declaration of *endpoints* existing in the code (*code first*).

Just as it is simple to provide an *endpoint*, creating an HTTP client is also similar in both *frameworks*, in which *the* client is built only with the creation of an annotated interface, making explicit in its methods, the verb, the path, its parameters, its headers and the request body, very similar to the already known *[Feign](https://github.com/OpenFeign/feign)* and *[Retrofit](https://square.github.io/retrofit/)*.

A point that can be considered interesting in *Micronaut* is in relation to the (de)serialization settings, where they can be defined in the configuration file, without the need for coding. Through this file it is possible to define from which naming strategy to use (*camel case, snake case, etc)*, to how the data should be converted while in *Quarkus*, this can only be done by encoding, increasing the amount of code produced/contained in the project.

Database access is similar, with both having *Hibernate* support and native support for multiple databases. The issue is how the queries that will be performed will be declared, with *Micronaut* supporting declarations through interfaces and descriptive methods, while *Quarkus*, as far as I could identify, performs in a more declarative and, consequently, verbose way.

In this project in question, we needed to perform a kind of versioning of all entities that were changed in the database, however, the history is stored in a service external to the application. The simplest way to perform this integration would be through an *interceptor* in *Hibernate.* With *Micronaut*, this integration is extremely simple, just having a *bean* of this type available in the context, which is automatically used. Regarding *Quarkus*, I couldn't identify how this integration would be carried out, nor could I find it, either on the internet or in its official documentation.

## Documentation

![Compatibility](/images/posts/pexels-anastasia-zhenina-93519.jpg#center)

I consider this one of the most important topics to be analyzed, because the documentation is and should always be used as a reference to analyze or build possible use cases, or just to understand the features provided by a tool.

At this point, I believe that *Quarkus* leaves a lot to be desired, as its documentation is based on practical guides and, particularly, I consider this very bad for a long-term project, but they are excellent for those who would like to test some integration or functionality. In other words, during the development of a project, the tendency is for research related to technology to change from "how to do something" to "why something happens". With the separation by tabs, this search becomes difficult and tiring, which would make people look for other means, like *Stack Overflow*, for example. As an example, I can mention the need mentioned above, to create an *Interceptor*, and I couldn't find examples of usage in the guides and even in search engines, I couldn't find anything related to it.

On the other hand, with *Micronaut*, its documentation is much more detailed and complete, I believe it lacks a lot to reach the level of content that the *Spring* documentation has, but it is possible to find practically everything related to a topic of centrally or in specific documentation for an extension, greatly reducing the need to open and read several guides on the same subject to find something specific.

## Conclusion

Both *frameworks* have support and compatibility with the scenarios we analyzed and could be easily adopted in any of our projects. However, *Micronaut*'s learning curve proved to be much smoother, with many similarities with the already used *Spring*, such as support for accessing databases through the declaration of interfaces and descriptive methods.

However, the factor that I believe had a greater weight in the decision was the documentation, which despite believing that it can still be evolved, in *Micronaut* it is much more complete and easier to find than the one found with the guides provided by *Quarkus .*

With all that said, if I were to leave the *Spring* universe, whether to adopt *GraalVM*, today I would choose *Micronaut*, without any great fears in this decision.

Thanks for reading and feel free to ask any questions you may have.
