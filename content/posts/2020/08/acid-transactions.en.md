---
title: "ACID Transactions"
date: 2020-08-18T22:00:00-03:00
tags:
  - database
  - architecture
url: "/posts/2020-08/acid-transactions/"
---

When multiple operations need to succeed or fail together, like transferring money between bank accounts, you need
guarantees that the database will not leave data in a partial or inconsistent state. **ACID** is the set of properties
that relational databases provide to ensure exactly that.

ACID is an acronym for **A**tomicity, **C**onsistency, **I**solation, and **D**urability. These four properties define
the behavior of transactions and protect data integrity even under concurrent access, application crashes, or hardware
failures.

## Atomicity

Atomicity means a transaction is treated as a single, indivisible unit. Either **all** operations in the transaction
succeed and are committed, or **none** of them take effect. There is no partial success.

Consider a bank transfer: to move $100 from account A to account B, two operations must happen, debit account A and
credit account B. If the debit succeeds but the credit fails (e.g., due to a network error), atomicity ensures the
debit is rolled back automatically, leaving both accounts unchanged.

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
UPDATE accounts SET balance = balance + 100 WHERE id = 'B';

COMMIT;
```

If anything goes wrong between `BEGIN` and `COMMIT`, a `ROLLBACK` undoes all changes. The database write-ahead log
(WAL) makes this possible, changes are recorded to a log before being applied, so incomplete transactions can always
be reversed.

## Consistency

Consistency guarantees that a transaction brings the database from one **valid state** to another valid state.
"Valid" is defined by all constraints, rules, and integrity checks configured in the schema: foreign key constraints,
unique constraints, check constraints, triggers, and so on.

If a transaction would violate any of these rules, for instance, inserting a row that references a non-existent
foreign key, the database rejects it and rolls back the transaction, preserving the valid pre-transaction state.

> Note: the "C" in ACID is different from the "C" in the [CAP theorem](/posts/2023-09/cap-theorem/). ACID consistency
> is about data integrity rules; CAP consistency is about whether all nodes in a distributed cluster return the same
> data at the same time.

## Isolation

Isolation defines how and when the changes made by one transaction become visible to other concurrent transactions.
Without isolation, concurrent transactions can interfere with each other, causing data anomalies.

The SQL standard defines four isolation levels, each preventing a different class of anomaly:

| Isolation Level    | Dirty Read | Non-Repeatable Read | Phantom Read |
|--------------------|------------|---------------------|--------------|
| Read Uncommitted   | Possible   | Possible            | Possible     |
| Read Committed     | Prevented  | Possible            | Possible     |
| Repeatable Read    | Prevented  | Prevented           | Possible     |
| Serializable       | Prevented  | Prevented           | Prevented    |

- **Dirty read**: a transaction reads data written by another transaction that has not yet committed. If that
  transaction rolls back, the read data never actually existed.
- **Non-repeatable read**: a transaction reads the same row twice and gets different values because another transaction
  modified and committed it in between.
- **Phantom read**: a transaction re-executes a query and finds different rows because another transaction inserted or
  deleted rows matching the query's filter.

Most databases default to **Read Committed** (PostgreSQL, Oracle, SQL Server) or **Repeatable Read** (MySQL InnoDB).
Higher isolation levels prevent more anomalies but reduce concurrency and can increase the chance of deadlocks.

## Durability

Durability guarantees that once a transaction is committed, its changes are permanent, even if the system crashes
immediately afterward. A power outage, OS crash, or application failure cannot cause committed data to disappear.

Databases achieve this through **write-ahead logging (WAL)**: before any data page is modified on disk, the change is
first written to a sequential log file. On recovery after a crash, the database replays the log to restore any
committed transactions that had not yet been flushed to the main data files.

This is also why `COMMIT` can sometimes be slow: the database must call `fsync` (or equivalent) to guarantee the log
entry is physically written to durable storage before acknowledging the commit.

## ACID vs. BASE

Not all databases prioritize ACID. Many NoSQL databases trade ACID guarantees for higher availability and horizontal
scalability, instead following the **BASE** model:

- **B**asically **A**vailable: the system remains available even during partial failures
- **S**oft state: data may be temporarily inconsistent across nodes
- **E**ventually consistent: the system will converge to a consistent state over time

Systems like Apache Cassandra and Amazon DynamoDB are BASE by default, making them better suited for use cases where
availability and write throughput matter more than strict consistency.

Some databases sit in between: **MongoDB** added multi-document ACID transactions in version 4.0, and
**CockroachDB** provides distributed ACID transactions by design.

## Which Databases Are ACID?

| Database            | ACID Support                                       |
|---------------------|----------------------------------------------------|
| PostgreSQL          | Full ACID                                          |
| MySQL (InnoDB)      | Full ACID                                          |
| Oracle              | Full ACID                                          |
| SQL Server          | Full ACID                                          |
| MongoDB             | Single-document always; multi-document since 4.0   |
| CockroachDB         | Full ACID (distributed)                            |
| Apache Cassandra    | Lightweight transactions only (not full ACID)      |
| Redis               | Partial (MULTI/EXEC blocks, but not full rollback) |

## Conclusion

ACID properties are the foundation of reliable data management in relational databases. Atomicity prevents partial
updates. Consistency enforces data rules. Isolation protects concurrent transactions from each other. Durability ensures
committed data survives failures. Understanding these guarantees, and knowing when a system provides them, is
essential for designing systems that handle data correctly under real-world conditions.

## References

- [PostgreSQL Documentation, Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)
- [MySQL Documentation, InnoDB and the ACID Model](https://dev.mysql.com/doc/refman/8.0/en/mysql-acid.html)
- [Designing Data-Intensive Applications, Martin Kleppmann (Chapter 7: Transactions)](https://dataintensive.net)