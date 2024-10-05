---
title: "Reactive programming with Spring WebFlux, should I use it?"
date: 2020-07-26T19:33:23-03:00
tags:
  - spring
  - spring mvc
  - spring webflux
  - reactive
images:
  - "/images/posts/abandoned-antique-architecture-building-277782.jpg"
url: "/posts/2020-07/should-i-use-spring-webflux/"
---

**Should I use it?**

    No, but maybe so!

I could stop the article here, but that wouldn't add anything and you would never understand why I start the text with a **no, but it may be yes**. The truth is, if you hope to use *WebFlux* and solve all your problems, I'm sorry to tell you that your problems may be just beginning.

Recently the subject *Advantages and Disadvantages about WebFlux* came up in my work and because I have little experience using *WebFlux*, I decided to seek more information on the subject and I intend to describe here my opinion about the use of *WebFlux* and, consequently, a little about reactive programming.

Reactive programming has been on the rise for some years and there is a lot of talk about performance gains, resource optimization, but the discussion on the subject is still very shallow and sometimes with an air of pure fad.

When researching the performance of reactive applications, we end up seeing wonderful graphics, as if all problems were solved with a simple paradigm shift, but often we don't notice that the comparisons turn out to be a little strange when compared to "real" applications. .

I am referring to the fact that these tests consider a complete migration of the application architecture, that is, from the code to the database, and this is usually not an option, as we cannot always replace our database, for example, from *MySQL* to *MongoDB* or *Cassandra*. This, for me, makes the results of these comparisons to be seen with a certain weight.

However, before making any changes to the code, we must always answer some questions that I consider fundamental for the success of tasks at this level.

* Is the team aware of the technology that will be used?
  * If not, will the team have time to learn the new technology?
* Does the team understand the advantages, disadvantages and risks of this technology?
* Is the new technology compatible with the other tools used? Eg: Database.

It is always important to answer these questions before starting a project with the adoption of a different technology than usual. This helps to prevent unexpected risks and possible delays in deliveries.

We developers often have the desire to use something new/different in our day-to-day tasks, but it is always important to consider what this will add, with difficulty, learning curve and inherent risks to this adhesion.

**Back to the main subject, *Spring WebFlux**...**

![Back to topic](/images/posts/green-typewriter-on-brown-wooden-table-4052198.jpg#center)

Among everything I read and had the opportunity to see in practice, I found the efficiency of applications built with *WebFlux* very interesting. It was the famous “a lot with a little”, but what caught my attention was the complexity of building unit/integrated tests as well as the difficulty in performing *debug*, since the call flow is no longer, so to speak, sequential.

Among the various articles I read, there were several reports of people who categorically stated that *WebFlux* was better, as it was possible to process requests in parallel, while in the model used by *Spring MVC*, only one request was performed at a time , which is false, as parallelism is created with *threads* and controlled by application servers, such as *Tomcat* and *Jetty*.

**Anyway, should I use *WebFlux* in my project?**

![Back to topic](/images/posts/banking-business-checklist-commerce-416322.jpg#center)

Well, that depends...

The fact that the application is built using a reactive paradigm (*WebFlux*) does not make it perform better than the imperative model (*Spring MVC*). Often the performance problem can be simply in the way things were implemented or even by consuming services that block a transaction for too long. There are other scenarios that could improve the performance of an application without first considering a technology migration, such as, for example, parameterization of the *JVM*.

In short, if today an application works well using *Spring MVC*, there "are" no real reasons to migrate to *WebFlux*, besides the fact that, depending on the problem, there may be another way to solve it, without first consider a technology migration.

However, if the application is having problems related to the amount of *threads*, or uses *streaming* of data, or even prioritizes an efficient use of *hardware* resources, perhaps the use of *WebFlux* is a way out.

Anyway, there is no magic formula that will tell whether or not we should use *WebFlux*, or *MVC* in our projects. It will always be necessary to analyze the scenario we have and compare it with the options we have available, but it is always important to understand the advantages and disadvantages of these and other technologies.

A migration may not be necessary now, but in the future it may be and it's always good to be prepared.
