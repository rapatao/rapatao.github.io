---
title: "What is a Reverse Proxy?"
date: 2022-10-22T12:00:00-03:00
tags:
    - architecture
    - network
images: 
  - src: "/images/posts/gate-g2919ae08c_640.jpg"
    alt: "What is a Reverse Proxy?"
url: "/posts/2022-10/what-is-a-reverse-proxy/"
aliases:
  - "/pt/posts/2022-10/what-is-a-reverse-proxy/"
---

A reverse proxy is a server that has as its main functionality to receive requests from an external network, usually the Internet, and forward them to servers on an internal network.

This server acts as the user's entry point to your application, which allows you to perform various types of customization on the received request, such as changing the request parameters or rewriting the path (*path*) in a *REST* request.

Load balancing is also one of the capabilities of these servers, where they can not only distribute the requests among the various instances of an application, but also send them to other instances according to the parameters received in the request.

For example, when a request is made to the *endpoint* `/search`, that request can be forwarded to the instances of a search service, whereas when it is `/users`, the requests go to the users service. 

This allows not only centralizing the access address to the available services, where everyone uses the same domain (*host*), but also allows load balancing between the various instances of each service.

Several other functionalities can be applied to these servers, some solutions have more, others less customizations/functionalities. As an example of applications for this purpose, we can mention:

- [NGINX](https://www.nginx.com/)
- [HAProxy](http://www.haproxy.org/)

## Conclusion

As you can see, a reverse proxy can improve not only the availability and scalability of an application, but also load balancing between applications. Not only that, but with its use it is also possible to centralize in a single address (*URL*) all available services, creating what we can call an *API Gateway*.

Other types of resources can be added at this layer, such as caching, authentication/authorization, certificate checks (TLS, mTLS), as well as improving the security of the services, since this is not available directly.

## Links

- [What Is a Reverse Proxy Server?](https://www.nginx.com/resources/glossary/reverse-proxy-server/)
- [What is a reverse proxy? | Proxy servers explained](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/)
- [Reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy)
- [What is Reverse Proxy Server/](https://www.imperva.com/learn/performance/reverse-proxy/)
- [What is the difference between Proxy and Reverse Proxy? | How To Use Reverse Proxy for Access Management Control](https://www.strongdm.com/blog/difference-between-proxy-and-reverse-proxy)