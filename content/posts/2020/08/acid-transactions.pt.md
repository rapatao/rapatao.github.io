---
title: "Transações ACID"
date: 2020-08-18T22:00:00-03:00
tags:
  - database
url: "/pt/posts/2020-08/acid-transactions/"
---

Quando múltiplas operações precisam ter sucesso ou falhar juntas — como uma transferência bancária entre contas —
é preciso ter garantias de que o banco de dados não deixará os dados em um estado parcial ou inconsistente. **ACID** é
o conjunto de propriedades que bancos de dados relacionais fornecem para garantir exatamente isso.

ACID é um acrônimo para **A**tomicidade, **C**onsistência, **I**solamento e **D**urabilidade. Essas quatro propriedades
definem o comportamento das transações e protegem a integridade dos dados mesmo sob acesso concorrente, falhas de
aplicação ou falhas de hardware.

## Atomicidade

Atomicidade significa que uma transação é tratada como uma única unidade indivisível. Ou **todas** as operações da
transação são bem-sucedidas e confirmadas, ou **nenhuma** delas tem efeito. Não existe sucesso parcial.

Considere uma transferência bancária: para mover R$100 da conta A para a conta B, duas operações devem acontecer —
debitar a conta A e creditar a conta B. Se o débito for bem-sucedido mas o crédito falhar (por exemplo, devido a um
erro de rede), a atomicidade garante que o débito seja desfeito automaticamente, deixando ambas as contas sem
alteração.

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
UPDATE accounts SET balance = balance + 100 WHERE id = 'B';

COMMIT;
```

Se algo der errado entre o `BEGIN` e o `COMMIT`, um `ROLLBACK` desfaz todas as mudanças. O log de escrita antecipada
(WAL — Write-Ahead Log) do banco de dados torna isso possível — as alterações são registradas no log antes de serem
aplicadas, de forma que transações incompletas sempre possam ser revertidas.

## Consistência

Consistência garante que uma transação leve o banco de dados de um **estado válido** para outro estado válido.
"Válido" é definido por todas as restrições, regras e verificações de integridade configuradas no schema: restrições
de chave estrangeira, restrições de unicidade, restrições de verificação, triggers e assim por diante.

Se uma transação violar qualquer uma dessas regras — por exemplo, inserir uma linha que referencia uma chave
estrangeira inexistente — o banco de dados a rejeita e reverte a transação, preservando o estado válido anterior à
transação.

> Nota: o "C" do ACID é diferente do "C" do [teorema CAP](/pt/posts/2023-09/teorema-cap/). A consistência do ACID
> trata de regras de integridade de dados; a consistência do CAP trata de todos os nós de um cluster distribuído
> retornarem os mesmos dados ao mesmo tempo.

## Isolamento

Isolamento define como e quando as alterações feitas por uma transação se tornam visíveis para outras transações
concorrentes. Sem isolamento, transações concorrentes podem interferir umas nas outras, causando anomalias nos dados.

O padrão SQL define quatro níveis de isolamento, cada um prevenindo uma classe diferente de anomalia:

| Nível de Isolamento  | Leitura Suja | Leitura Não-Repetível | Leitura Fantasma |
|----------------------|--------------|-----------------------|------------------|
| Read Uncommitted     | Possível     | Possível              | Possível         |
| Read Committed       | Prevenido    | Possível              | Possível         |
| Repeatable Read      | Prevenido    | Prevenido             | Possível         |
| Serializable         | Prevenido    | Prevenido             | Prevenido        |

- **Leitura suja (dirty read)**: uma transação lê dados escritos por outra transação que ainda não foi confirmada. Se
  essa transação for revertida, os dados lidos nunca existiram de fato.
- **Leitura não-repetível (non-repeatable read)**: uma transação lê a mesma linha duas vezes e obtém valores
  diferentes porque outra transação a modificou e confirmou no intervalo.
- **Leitura fantasma (phantom read)**: uma transação re-executa uma consulta e encontra linhas diferentes porque outra
  transação inseriu ou removeu linhas que atendem ao filtro da consulta.

A maioria dos bancos de dados usa como padrão **Read Committed** (PostgreSQL, Oracle, SQL Server) ou **Repeatable
Read** (MySQL InnoDB). Níveis mais altos de isolamento previnem mais anomalias, mas reduzem a concorrência e podem
aumentar a ocorrência de deadlocks.

## Durabilidade

Durabilidade garante que, uma vez confirmada uma transação, suas alterações são permanentes — mesmo que o sistema
falhe imediatamente após. Uma queda de energia, falha do SO ou falha da aplicação não pode fazer com que dados
confirmados desapareçam.

Bancos de dados alcançam isso por meio do **write-ahead logging (WAL)**: antes de qualquer página de dados ser
modificada em disco, a alteração é primeiro gravada em um arquivo de log sequencial. Na recuperação após uma falha, o
banco de dados reaplica o log para restaurar todas as transações confirmadas que ainda não tinham sido gravadas nos
arquivos de dados principais.

É também por isso que o `COMMIT` às vezes pode ser lento: o banco de dados precisa chamar `fsync` (ou equivalente)
para garantir que a entrada do log seja fisicamente gravada no armazenamento durável antes de confirmar o commit.

## ACID vs. BASE

Nem todos os bancos de dados priorizam ACID. Muitos bancos de dados NoSQL trocam as garantias ACID por maior
disponibilidade e escalabilidade horizontal, seguindo o modelo **BASE**:

- **B**asicamente **D**isponível (Basically Available): o sistema permanece disponível mesmo durante falhas parciais
- **E**stado **S**uave (Soft state): os dados podem estar temporariamente inconsistentes entre os nós
- **C**onsistência **E**ventual (Eventually consistent): o sistema convergirá para um estado consistente ao longo do
  tempo

Sistemas como Apache Cassandra e Amazon DynamoDB são BASE por padrão, tornando-os mais adequados para casos de uso
onde disponibilidade e throughput de escrita importam mais do que consistência estrita.

Alguns bancos de dados ficam no meio-termo: o **MongoDB** adicionou transações ACID multi-documento na versão 4.0, e
o **CockroachDB** fornece transações ACID distribuídas por design.

## Quais Bancos de Dados São ACID?

| Banco de Dados      | Suporte ACID                                              |
|---------------------|-----------------------------------------------------------|
| PostgreSQL          | ACID completo                                             |
| MySQL (InnoDB)      | ACID completo                                             |
| Oracle              | ACID completo                                             |
| SQL Server          | ACID completo                                             |
| MongoDB             | Documento único sempre; multi-documento desde a versão 4.0|
| CockroachDB         | ACID completo (distribuído)                               |
| Apache Cassandra    | Transações leves apenas (não é ACID completo)             |
| Redis               | Parcial (blocos MULTI/EXEC, mas sem rollback completo)    |

## Conclusão

As propriedades ACID são o alicerce do gerenciamento confiável de dados em bancos relacionais. Atomicidade previne
atualizações parciais. Consistência garante as regras dos dados. Isolamento protege transações concorrentes umas das
outras. Durabilidade assegura que dados confirmados sobrevivam a falhas. Compreender essas garantias — e saber quando
um sistema as fornece — é essencial para projetar sistemas que manipulam dados corretamente sob condições reais.

## Referências

- [Documentação PostgreSQL — Transações](https://www.postgresql.org/docs/current/tutorial-transactions.html)
- [Documentação MySQL — InnoDB e o Modelo ACID](https://dev.mysql.com/doc/refman/8.0/en/mysql-acid.html)
- [Designing Data-Intensive Applications — Martin Kleppmann (Capítulo 7: Transações)](https://dataintensive.net)