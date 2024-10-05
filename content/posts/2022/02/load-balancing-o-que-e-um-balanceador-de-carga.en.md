---
title: "Load Balancing: What is a load balancer?"
date: 2022-02-05T20:00:00-03:00
tags:
  - architecture
  - network
images:
  - "/images/posts/pexels-brett-sayles-7146867.jpg"
url: "/posts/2022-02/load-balancing-what-is-a-load-balancer/"
---

Widely used in applications with high volume of simultaneous access, a load balancer is a computational resource used to perform load distribution between two or more servers of an application.

They are usually implemented using machines dedicated to this work, which can be physical or virtual, or by “*software*”.

## Benefits

Regardless of the model to be implemented, they aim to distribute the processing of an application among the available instances, seeking to optimize the use of computational resources, such as network, processing (*CPU*), memory usage, among others.

This distribution of resources reduces the risk that the instances of an application are overloaded, consequently optimizing response times at times of high number of simultaneous accesses to the application.

Another benefit that comes from using load balancing is the increase in availability (resilience), as they use application sanity validation, which means that in cases where one or more instances are unavailable, no traffic is forwarded to them, thus helping the end user not to perceive this unavailability.

## Balancing models

A load balancer can operate in two network layers of the [*OSI*](https://pt.wikipedia.org/wiki/Modelo_OSI) model, layer 4 (transport) and layer 7 (application). Balancers built in the transport layer tend to require less processing power to perform the task, however, they have access to less request information than application layer implementations. Although more expensive, in relation to the need for processing, layer 7 deployments tend to bring many benefits and with increasingly affordable costs, its adoption has grown a lot in recent years.

<aside>
💡 It is important to note that there are cases where an application layer balancer would not be justified (cost x benefit), as the requests to be processed never require control that is not obtained with transport layer deployments.
</aside>

### Layer 4: Transport

This balancing model works at the transport layer, that is, routing decisions are based on data available there, that is, protocol information, such as *TCP* or *UDP*, destination and source *IP* addressing. Based on this information, the packet is forwarded through a resource called [*NAT*](https://pt.wikipedia.org/wiki/Network_address_translation).

It is important to note that balancing at this layer is done purely with this information, that is, the packet content is not intercepted and/or analyzed during forwarding, which can make it difficult or even disable the creation of rules that guarantee that the same user have your requests always directed to the same instance of an application, which can be problematic when, for example, there is a need for user session control.

### Layer 7: Application

This balancing model offers more resources for balancing decisions and this is due to the fact that it works at the highest layer of the OSI model. As it is in this layer, it is possible to analyze, in addition to the existing information in layer 4, as well as other information related to the received request to decide which instance the request will be forwarded to. For example, in an HTTP request balancing, we can check information contained in the header to decide the destination server, this allows us to control the distribution in the use of resources, but also allows us to guarantee other controls, such as, for example, guarantee that all requests of a given user are always processed by the same application instance.

## Balancing Strategies

The principle of a load balancer is to distribute the requests among the servers available for processing the request, however, in practically all implementations, we can define how these requests will be distributed among the instances of our application. This decision is made by pre-defined algorithms, but it is usually also possible to create custom rules.

In this text I will describe two of the algorithms that I believe to be the most used, however, several others exist and it is always recommended to evaluate them before choosing which one to use in your application.

### Round Robin

This algorithm is normally the standard used by many balancing solutions on the market. In it, each request is forwarded to a different instance among the available ones, following a standardized and continuous order.

<aside>
💡 Example: Considering 3 destination servers, the first request will be forwarded to the first server, the second to the second server and the third to the third server. From the fourth request, the list of servers is restarted, that is, it would be forwarded to the first server, the next to the second and so on.
</aside>

Although effective for most cases, this algorithm can cause overload on one of the servers, as it does not consider pending requests to forward a request or not. That is, it can be problematic for cases where most requests processed by the application have very different times between them and require intensive use of processing to complete, which means that one of the servers may have more requests being processed at a given moment than others, consequently degrading application performance.

### Least Connection

This algorithm forwards to servers using a simple analysis model, which consists of verifying which server among those available has the least amount of requests at the moment.

<aside>
💡 Example: Considering 3 destination servers, where we currently have the first with 5 connections, the second with 3 and the third with 4, in this model, the next request would be forwarded to the second server, as it is the one with the fewest active connections at the moment and that logic would be applied to all new requests.
</aside>

In other words, it is a very efficient model in relation to load distribution and usually superior in performance, as the server with the lowest number of requests will always be the one chosen to receive the next request. However, it can still be impacted by the distribution of requests, where a server, despite having fewer connections, all require high processing power, thus degrading all active requests on this server.

## Existing solutions

There are several devices and applications on the market in order to offer a load balancing solution. *cloud* providers such as *[Amazon AWS](https://aws.amazon.com/elasticloadbalancing/)* and *[Google Cloud](https://cloud.google.com/load-balancing)*, also have native solutions available, which can facilitate their implementation when using these providers.

In the *Open Source* world, there are several solutions created for this purpose, each with its advantages and disadvantages.

Here is a list of what I believe to be the main solutions currently and their respective layers of action:

- [HAProxy](https://github.com/haproxy/haproxy) (layer 4 and 7)
- [nginx](https://github.com/nginx/nginx) (layer 4 and 7)
- [Seesaw](https://github.com/google/seesaw) (Layer 4)
- [Traefik](https://github.com/traefik/traefik) (layer 7)

## Conclusion

Briefly, a load balancer (*load balancer*) is a computational resource, which can be a device or an application, responsible for distributing the processing between the different instances of an application through defined strategies.

It acts as an intermediary (*proxy*), receiving and directing requests according to defined rules and aiming not only to increase the processing capacity of the application but also its availability.

I hope this text has helped you understand what a load balancer is and some of the problems this solution aims to solve. Finally, I leave some links that were useful to me during the preparation of this text.

## References

- [What Is Layer 4 Load Balancing?](https://www.nginx.com/resources/glossary/layer-4-load-balancing/)
- [What is a Load Balancer? Load Balancing Definition](https://www.citrix.com/en-in/solutions/app-delivery-and-security/load-balancing/what-is-load-balancing.html)
- [Load balancing (computing)](https://en.wikipedia.org/wiki/Load_balancing_(computing))