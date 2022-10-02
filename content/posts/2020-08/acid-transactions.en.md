---
title: "ACID Transactions"
date: 2020-08-18T22:00:00-03:00
tags:
    - database
images: 
  - src: "/images/posts/campaign-creators-IKHvOlZFCOg-unsplash.jpg"
    alt: "ACID Transactions"
    stretch: "vertical"
url: "/posts/2020-08/acid-transactions/"
---

# ACID transactions

Acronym for **A**tomicity, **C**consistency, **I**insulation and **D**urability is a set of properties of a database transaction that aim to ensure data integrity and validity, even after systemic failures or electrical power failures.

### Atomicity

It treats as a unit, all operations performed for a task, that is, all instructions will be successfully carried out or, none of them should be carried out. For example, in a bank transfer, in case of failure in any of the steps, the entire process must be undone and the values returned to the original.

### Consistency

Data is considered to be consistent and should be kept that way even after other transactions. That is, in a bank transfer process, if the deposit step fails, the data must return to its initial state, with the amount returned to the source account. The base state should only be changed if all operations complete successfully.

### Isolation

Determines when and how values changed by one transaction will be available for other transactions. For example, in a case where a value is being changed and queried simultaneously, the system must guarantee that the value returned is exactly the result of the change transaction, not returning data different from the actual one. This ensures that, in case the write operation fails, the value returned to the query is the original value and not what it was supposed to be after the write operation was completed.

### Durability

It guarantees that a data, when persisted, will be available even after a failure, such as, for example, a fatal error in the application or even a power outage. That is, the storage of these values is done effectively, guaranteeing their availability after reestablishment of services.

## Conclusion

Basically, ACID aims to guarantee that transactions carried out in a system are always carried out in full, guaranteeing data availability even after critical failures, such as power outages. It also aims to ensure that in a high concurrency system, the values consulted are always consistent with the values persisted in the base, avoiding the so-called dirty reads, where a data is returned with a pre-effective value of a write, which may or may not occur. successfully.
