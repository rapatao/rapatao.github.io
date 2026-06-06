---
title: "CAP Theorem"
date: 2023-09-22T09:00:00Z
tags:
  - database
  - system design
url: "/posts/2023-09/cap-theorem/"
---

When designing distributed systems, one of the most fundamental questions is: what guarantees can your system actually
provide? The CAP theorem, formulated by Eric Brewer in 2000 and formally proven by Seth Gilbert and Nancy Lynch in 2002,
answers this by stating that any distributed data store can only guarantee two out of three properties: **Consistency**,
**Availability**, and **Partition Tolerance**.

## Consistency

In the context of the CAP theorem, consistency means that every read operation receives the most recent write or an
error. All database nodes will hold the same data at the same time — there are no stale reads.

This is sometimes referred to as **strong consistency** or **linearizability**: operations appear to execute
instantaneously and in a total order. If you write a value and immediately read it from any node in the cluster, you
will always get that value back.

It is important not to confuse this with the "C" in ACID transactions, which refers to data integrity constraints.
CAP consistency is strictly about read-after-write guarantees across distributed nodes.

## Availability

Availability means that every request sent to a non-failed node receives a response — it will not be an error or a
timeout. The response may not contain the most recent write, but the system always responds.

A highly available system maximizes uptime and ensures that the service continues to operate even when some nodes are
degraded. The key here is that **every request must get a response**, even if that response is based on slightly
outdated data.

## Partition Tolerance

A partition occurs when network failures cause some nodes to be unable to communicate with others. Partition tolerance
means the system continues to operate correctly even when this happens.

In any real-world distributed system deployed across multiple machines or data centers, network partitions are
**unavoidable** — hardware fails, cables get cut, and network congestion happens. This makes partition tolerance less of
a choice and more of a requirement for any truly distributed system.

## Trade-offs

Because partitions cannot be avoided, the real choice in distributed systems comes down to:

- **CP (Consistency + Partition Tolerance)**: The system prioritizes consistency. When a partition occurs, nodes that
  cannot guarantee they have the latest data will refuse to respond (returning an error or timeout) rather than serving
  stale data. Examples: **Apache ZooKeeper**, **HBase**, **etcd**, **MongoDB** (with strong read concern).

- **AP (Availability + Partition Tolerance)**: The system prioritizes availability. When a partition occurs, nodes
  continue to serve requests even if the data might be stale. The system eventually converges once the partition heals —
  a property known as **eventual consistency**. Examples: **Apache Cassandra**, **Amazon DynamoDB**, **CouchDB**,
  **Riak**.

- **CA (Consistency + Availability)**: A system that provides both consistency and availability can only do so in the
  absence of partitions. Traditional relational databases like **PostgreSQL** and **MySQL** fall into this category when
  running on a single node or a tightly coupled cluster. However, once they are distributed across failure domains, they
  effectively become CP or AP.

## Practical Implications

Choosing between CP and AP depends on your use case:

- **Financial systems** (banking, payments) typically require CP. Serving a stale account balance could lead to
  overdrafts or double-spending — correctness matters more than uptime.

- **Social media feeds, recommendation engines, DNS** typically favor AP. Showing a slightly outdated timeline or a
  cached DNS response is acceptable; being unavailable is not.

- Many modern systems allow you to tune the trade-off per operation. Cassandra, for example, lets you configure
  consistency levels per query — `QUORUM` reads/writes lean toward CP behavior, while `ONE` leans toward AP.

## Beyond CAP: The PACELC Theorem

The CAP theorem only describes behavior during a partition. In 2012, Daniel Abadi proposed the **PACELC theorem** as an
extension: even when the system is running normally (no partition), there is still a trade-off between **latency** and
**consistency**.

PACELC states: if there is a Partition (P), choose between Availability (A) and Consistency (C); Else (E), even without
partitions, choose between Latency (L) and Consistency (C).

This is a more practical model for everyday system design decisions, since low latency often requires relaxing
consistency (e.g., returning cached data without verifying it is up to date).

## Conclusion

The CAP theorem is a powerful mental model for reasoning about distributed systems. Since network partitions are
inevitable, architects must choose between consistency and availability based on their application's requirements.
CP systems favor correctness; AP systems favor resilience and responsiveness. Understanding this trade-off — and being
explicit about it in your design — is essential for building reliable distributed systems.

## References

- [Brewer's conjecture and the feasibility of consistent, available, partition-tolerant web services (Gilbert & Lynch, 2002)](https://dl.acm.org/doi/10.1145/564585.564601)
- [CAP Twelve Years Later: How the "Rules" Have Changed (Brewer, 2012)](https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/)
- [Consistency Tradeoffs in Modern Distributed Database System Design (Abadi, 2012)](https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf)