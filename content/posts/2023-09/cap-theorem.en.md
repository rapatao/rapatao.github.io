---
title: "CAP Theorem"
date: 2023-09-22T09:00:00Z
tags:
  - database
  - system design
images:
  - "/images/posts/light-bulds.jpg"
url: "/posts/2023-09/cap-theorem/"
---

CAP theorem is a fundamental principle in distributed database systems that states only two out of the three:
consistency, availability, and partition tolerance, can be achieved at any given time.

## Consistency

In the context of the CAP theorem, consistency means that every read operation receives the most recent write or an
error. All database nodes will hold the same data at the same time.

## Availability

Availability means that each request made to the system either receives a valid response or error, regardless of the
state of the system. Every non-failed node returns a response in a reasonable amount of time, therefore maximizing
uptime.

## Partition Tolerance

Partition tolerance explains the system's ability to continue working despite physical network splits. It means the
system as a whole can tolerate network failures that partition the system.

## Trade-offs

In reality, no distributed system can simultaneously provide more than two of these three guarantees. Thus, in the
presence of a network partition, one has to choose between consistency and availability.

## Conclusion

In practice, the CAP theorem implies that in distributed systems, there are trade-offs between consistency,
availability, and partition tolerance. Specifically, a system can only guarantee two out of these three aspects at any
given moment. Therefore, system architects must carefully consider their system's requirements and use-cases before
deciding on the appropriate balance.