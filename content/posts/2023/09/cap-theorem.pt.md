---
title: "Teorema CAP"
date: 2023-09-22T09:00:00Z
tags:
  - database
  - system design
url: "/pt/posts/2023-09/teorema-cap/"
---

Ao projetar sistemas distribuídos, uma das perguntas mais fundamentais é: quais garantias o seu sistema pode realmente
oferecer? O teorema CAP, formulado por Eric Brewer em 2000 e formalmente provado por Seth Gilbert e Nancy Lynch em 2002,
responde a isso afirmando que qualquer banco de dados distribuído só pode garantir dois de três propriedades:
**Consistência**, **Disponibilidade** e **Tolerância a Partições**.

## Consistência

No contexto do teorema CAP, consistência significa que cada operação de leitura recebe a gravação mais recente ou um
erro. Todos os nós do banco de dados terão os mesmos dados ao mesmo tempo, leituras desatualizadas não ocorrem.

Isso é às vezes chamado de **consistência forte** ou **linearizabilidade**: as operações parecem executar
instantaneamente e em uma ordem total. Se você gravar um valor e imediatamente lê-lo de qualquer nó do cluster, sempre
obterá esse valor de volta.

É importante não confundir isso com o "C" das transações ACID, que se refere a restrições de integridade de dados. A
consistência no CAP trata estritamente de garantias de leitura após escrita entre nós distribuídos.

## Disponibilidade

Disponibilidade significa que cada requisição enviada a um nó não falho recebe uma resposta, não será um erro ou um
timeout. A resposta pode não conter a gravação mais recente, mas o sistema sempre responde.

Um sistema com alta disponibilidade maximiza o tempo de atividade e garante que o serviço continue operando mesmo quando
alguns nós estão degradados. O ponto central aqui é que **toda requisição deve receber uma resposta**, mesmo que essa
resposta seja baseada em dados ligeiramente desatualizados.

## Tolerância a Partições

Uma partição ocorre quando falhas de rede fazem com que alguns nós não consigam se comunicar com outros. Tolerância a
partições significa que o sistema continua operando corretamente mesmo quando isso acontece.

Em qualquer sistema distribuído real implantado em múltiplas máquinas ou data centers, partições de rede são
**inevitáveis**, hardware falha, cabos são cortados e congestionamentos de rede acontecem. Isso torna a tolerância a
partições menos uma escolha e mais um requisito para qualquer sistema verdadeiramente distribuído.

## Trade-offs

Como partições não podem ser evitadas, a escolha real em sistemas distribuídos se resume a:

- **CP (Consistência + Tolerância a Partições)**: O sistema prioriza a consistência. Quando uma partição ocorre, nós
  que não podem garantir que possuem os dados mais recentes recusarão responder (retornando erro ou timeout) em vez de
  servir dados desatualizados. Exemplos: **Apache ZooKeeper**, **HBase**, **etcd**, **MongoDB** (com strong read
  concern).

- **AP (Disponibilidade + Tolerância a Partições)**: O sistema prioriza a disponibilidade. Quando uma partição ocorre,
  os nós continuam atendendo requisições mesmo que os dados possam estar desatualizados. O sistema eventualmente
  converge após a recuperação da partição, propriedade conhecida como **consistência eventual**. Exemplos:
  **Apache Cassandra**, **Amazon DynamoDB**, **CouchDB**, **Riak**.

- **CA (Consistência + Disponibilidade)**: Um sistema que oferece tanto consistência quanto disponibilidade só pode
  fazê-lo na ausência de partições. Bancos de dados relacionais tradicionais como **PostgreSQL** e **MySQL** se
  enquadram nessa categoria quando executados em um único nó ou cluster fortemente acoplado. Porém, uma vez distribuídos
  entre domínios de falha, efetivamente se tornam CP ou AP.

## Implicações Práticas

A escolha entre CP e AP depende do seu caso de uso:

- **Sistemas financeiros** (bancos, pagamentos) tipicamente exigem CP. Exibir um saldo desatualizado pode levar a
  overdrafts ou gasto duplo, a correção importa mais do que o tempo de atividade.

- **Feeds de redes sociais, motores de recomendação, DNS** geralmente favorecem AP. Mostrar uma timeline ligeiramente
  desatualizada ou uma resposta DNS em cache é aceitável; ficar indisponível não é.

- Muitos sistemas modernos permitem ajustar esse trade-off por operação. O Cassandra, por exemplo, permite configurar
  níveis de consistência por consulta, leituras/gravações com `QUORUM` tendem ao comportamento CP, enquanto `ONE`
  tende ao AP.

## Além do CAP: O Teorema PACELC

O teorema CAP descreve apenas o comportamento durante uma partição. Em 2012, Daniel Abadi propôs o **teorema PACELC**
como extensão: mesmo quando o sistema está funcionando normalmente (sem partição), ainda existe um trade-off entre
**latência** e **consistência**.

O PACELC afirma: se há uma Partição (P), escolha entre Disponibilidade (A) e Consistência (C); Caso contrário (E),
mesmo sem partições, escolha entre Latência (L) e Consistência (C).

Esse é um modelo mais prático para decisões cotidianas de design de sistemas, pois baixa latência frequentemente exige
relaxar a consistência (por exemplo, retornar dados em cache sem verificar se estão atualizados).

## Conclusão

O teorema CAP é um modelo mental poderoso para raciocinar sobre sistemas distribuídos. Como partições de rede são
inevitáveis, os arquitetos devem escolher entre consistência e disponibilidade com base nos requisitos da aplicação.
Sistemas CP favorecem a correção; sistemas AP favorecem resiliência e responsividade. Entender esse trade-off, e ser
explícito sobre ele no seu design, é essencial para construir sistemas distribuídos confiáveis.

## Referências

- [Brewer's conjecture and the feasibility of consistent, available, partition-tolerant web services (Gilbert & Lynch, 2002)](https://dl.acm.org/doi/10.1145/564585.564601)
- [CAP Twelve Years Later: How the "Rules" Have Changed (Brewer, 2012)](https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/)
- [Consistency Tradeoffs in Modern Distributed Database System Design (Abadi, 2012)](https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf)