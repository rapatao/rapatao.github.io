---
title: "Transações ACID"
date: 2020-08-18T22:00:00-03:00
tags:
  - database
images:
  - "/images/posts/campaign-creators-IKHvOlZFCOg-unsplash.jpg"
url: "/pt/posts/2020-08/acid-transactions/"
---

# Transações ACID

Acrônimo de **A**tomicidade, **C**onsistência, **I**solamento e **D**urabilidade é um conjunto de propriedades de uma transação de bancos de dados que visam garantir a integridade e validade de dados, mesmo após falhas sistêmicas ou até falhas de energia elétrica.

### Atomicidade

Trata como unidade, todas as operações realizadas para uma tarefa, ou seja, todas as instruções serão efetivadas com sucesso ou então, nenhuma delas deverá ser efetivada. Por exemplo, em uma transferência bancária, em caso de falha em qualquer uma das etapas, todo o processo deve ser desfeito e os valores retornados ao original.

### Consistência

Considera-se que os dados são consistentes e, devem ser mantidos desta forma mesmo após outras transações. Ou seja, em um processo de transferência bancária, caso ocorra falha na etapa de depósito, os dados devem retornar ao seu estado inicial, com o valor devolvido na conta origem. O estado da base só deve ser alterado, caso todas as operações concluam com sucesso.

### Isolamento

Determina quando e como os valores alterados por uma transação estarão disponíveis para as demais transações. Por exemplo, em um caso onde um valor está sendo alterado e consultado simultaneamente, o sistema deve garantir que o valor retornado seja exatamente o resultado da transação de alteração, não retornando um dado diferente do real. Isso garante que, em caso de falha na operação de escrita, o valor retornado para a consulta seja o valor original e não o que supostamente seria após conclusão da operação de escrita.

### Durabilidade

Garante que um dado, ao ser persistido, estará disponível mesmo após alguma falha, como, por exemplo, erro fatal na aplicação ou mesmo falta de energia elétrica. Ou seja, o armazenamento destes valores seja feito de forma efetiva, garantindo sua disponibilidade após reestabelecimento dos serviços.

## Conclusão

Basicamente, ACID visa garantir que as transações realizadas em um sistema, sejam sempre realizados de forma íntegra, garantindo a disponibilidade dos dados mesmo após falhas criticas, como falta de energia elétrica. Visa também garantir que em um sistema de alta concorrência, os valores consultados sejam sempre condizentes com os valores persistidos na base, evitando as chamadas leituras sujas, onde um dado é retornado com um valor pré-efetivação de uma escrita, que pode ou não ocorrer com sucesso.
