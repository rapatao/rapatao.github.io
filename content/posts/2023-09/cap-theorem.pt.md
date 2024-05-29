---
title: "Teorema CAP"
date: 2023-09-22T09:00:00Z
tags:
  - database
  - system design
images:
  - "/images/posts/light-bulds.jpg"
url: "/pt/posts/2023-09/teorema-cap/"
---

# Teorema CAP

O teorema CAP é um princípio fundamental nos sistemas de banco de dados distribuídos que afirma que apenas dois dos
três: consistência, disponibilidade e tolerância a partições, podem ser alcançados a qualquer momento.

## Consistência

No contexto do teorema CAP, consistência significa que cada operação de leitura recebe a gravação mais recente ou um
erro. Todos os nós do banco de dados terão os mesmos dados ao mesmo tempo.

## Disponibilidade

Disponibilidade significa que cada requisição feita ao sistema recebe uma resposta válida ou erro, independentemente do
estado do sistema. Todo nó não falho retorna uma resposta em um tempo razoável, maximizando assim o tempo de atividade.

## Tolerância a Partições

Tolerância a partições explica a capacidade do sistema de continuar funcionando, apesar de divisões físicas na rede.
Isso significa que o sistema como um todo pode tolerar falhas de rede que dividem o sistema.

## Trade-offs

Na realidade, nenhum sistema distribuído pode fornecer simultaneamente mais do que duas destas três garantias. Portanto,
na presença de uma partição de rede, deve-se escolher entre consistência e disponibilidade.

## Conclusão

Na prática, o teorema CAP implica que em sistemas distribuídos, existem comprometimentos entre consistência,
disponibilidade e tolerância a partição. Especificamente, um sistema só pode garantir dois destes três aspectos em
qualquer momento dado. Portanto, os arquitetos de sistema devem considerar cuidadosamente as necessidades e os casos de
uso de seu sistema antes de decidir sobre o equilíbrio apropriado.