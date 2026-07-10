---
title: "Documentando Decisões com ADRs: Por Que Seu Código Precisa de Memória"
date: 2026-07-10T10:00:00Z
tags: [architecture, adr, documentation, decisions, engineering]
url: "/pt/posts/2026-07/documentando-decisoes-com-adrs/"
---

Todo codebase tem fantasmas. Aquela lógica de retry estranha que ninguém ousa tocar. A coluna do banco que jamais pode ser nula. A biblioteca que você trocou três anos atrás por um motivo que ninguém lembra. Alguém tomou uma decisão, ela importava, e então o raciocínio evaporou no momento em que essa pessoa saiu do time, ou simplesmente esqueceu.

O problema não é que decisões são tomadas. É que decisões são tomadas e depois perdidas. Seis meses depois alguém pergunta "por que fazemos assim?" e a resposta honesta é um dar de ombros. Esse dar de ombros é caro. Leva a reverter boas decisões, rediscutir debates já encerrados, e repetir erros que já foram pagos uma vez.

Architecture Decision Records, ou ADRs, são a solução mais barata que conheço para esse problema.

## O Que um ADR Realmente É

Um ADR é um documento curto que captura uma decisão arquiteturalmente significativa, o contexto que a forçou, e as consequências que a seguem. É isso. Não é um documento de design, não é uma spec, não é uma página de wiki que apodrece. É um registro pequeno e imutável de uma única escolha, escrito no momento em que a escolha é feita.

O formato foi popularizado por Michael Nygard em 2011, e seu poder vem das suas restrições:

- **Uma decisão por registro.** Nada de documentos gigantes cobrindo o sistema inteiro.
- **Escrito quando a decisão está fresca.** Não reconstruído meses depois pela memória.
- **Imutável.** Você não edita uma decisão, você a substitui por uma nova.

Esse último ponto é o que as pessoas ignoram. Um ADR é um log, não uma wiki. Ele preserva história, incluindo as decisões que você depois reverteu. Saber que você *tentou* algo e abandonou frequentemente vale mais do que apenas o estado atual.

## O Que Conta Como "Arquiteturalmente Significativo"

Nem toda escolha merece um ADR. Você não registra qual nome de variável escolheu. O critério é se a decisão é **cara de reverter** ou **difícil de entender depois**.

Bons candidatos:

- Escolher um banco de dados, message broker ou provedor de nuvem.
- Adotar (ou rejeitar) um framework ou dependência importante.
- Definir um contrato de API ou uma estratégia de versionamento.
- Um padrão estrutural: event sourcing, CQRS, uma divisão entre monolito e microsserviços.
- Uma restrição de segurança ou compliance que molda o design.

Maus candidatos: regras de formatação, convenções de nomenclatura, qualquer coisa já garantida por um linter. Se uma ferramenta consegue codificar, uma ferramenta deve, não um documento.

Um teste útil: *se um engenheiro novo perguntaria "peraí, por que é assim?", provavelmente merece um ADR.*

## A Anatomia de um ADR

Mantenha pequeno. Um bom ADR cabe em uma tela. Aqui está a estrutura que uso:

```markdown
# ADR-0007: Usar PostgreSQL como datastore principal

## Status
Aceito

## Contexto
Precisamos de um datastore principal para o serviço de pedidos.
Nossos dados são altamente relacionais (pedidos, itens, clientes,
estoque) com requisitos fortes de consistência sobre níveis de
estoque. O time tem experiência sólida em SQL. Avaliamos MongoDB
e DynamoDB.

## Decisão
Usaremos PostgreSQL como datastore principal.

## Consequências
- Ganhamos transações ACID, das quais a lógica de estoque depende.
- Assumimos o custo operacional de gerenciar um banco relacional.
- Escalar horizontalmente exigirá esforço deliberado (réplicas de
  leitura, particionamento) se a carga crescer além de um primário.
- Dados em formato de documento, se surgirem, usarão a coluna JSONB
  em vez de um store separado.
```

As quatro seções carregam toda a carga:

- **Status.** Proposto, Aceito, Depreciado ou Substituído. Esta é a máquina de estados da decisão.
- **Contexto.** As forças em jogo. Quais restrições, requisitos e trade-offs levaram até aqui? Esta é a seção mais valiosa e a mais frequentemente ignorada.
- **Decisão.** A escolha em si, declarada de forma clara e ativa: "Usaremos..."
- **Consequências.** O que fica mais fácil, o que fica mais difícil. ADRs honestos listam também as desvantagens. Uma decisão sem nenhum ponto negativo listado é uma decisão que não foi examinada.

### O Ciclo de Vida do Status

O campo de status é o que faz dos ADRs um registro vivo em vez de um cemitério. Uma decisão passa por estados:

```text
Proposto  ->  Aceito  ->  Depreciado
                      ->  Substituído pelo ADR-0012
```

Quando uma nova decisão substitui uma antiga, você não apaga o ADR antigo. Você o marca como `Substituído pelo ADR-0012` e, no novo registro, referencia o que ele substitui. A cadeia de raciocínio permanece intacta. Quem ler o ADR-0007 depois vê imediatamente que a história continuou em outro lugar.

## Onde os ADRs Vivem

Minha preferência forte é mantê-los no repositório, junto do código, sob controle de versão. Você pode perfeitamente colocá-los em outro lugar, como uma wiki, Confluence, ou um portal de docs, e para alguns times isso se encaixa melhor. Mas quanto mais longe do código eles ficam, mais difíceis são de manter e mais fácil é esquecer de atualizar ou consultar.

```text
docs/
  adr/
    0001-registrar-decisoes-de-arquitetura.md
    0002-usar-postgresql-como-datastore-principal.md
    0003-adotar-rest-em-vez-de-graphql.md
    ...
```

O que você ganha mantendo-os no repo:

- **Viajam com o código.** Clone o repo, receba as decisões.
- **São revisados como código.** Um ADR passa por um pull request. A decisão é discutida *antes* de ser aceita, na mesma ferramenta onde o trabalho acontece.
- **Versionam com o código.** Você consegue ver quais ADRs estavam em vigor em qualquer commit.

Uma página de wiki tende a se distanciar da realidade justamente porque atualizá-la é um passo separado que ninguém lembra. Um ADR no repo, revisado num PR, faz parte do mesmo fluxo que produz o software, então mantê-lo atualizado custa quase nada. Onde quer que você os coloque, o objetivo é o mesmo: tornar a decisão fácil de encontrar e difícil de esquecer.

Há também um bônus moderno: o mesmo contexto que ajuda um engenheiro novo ajuda um agente de IA. Aponte um agente para seu diretório `docs/adr/` e ele para de adivinhar por que o sistema tem a forma que tem. Ele respeita os trade-offs que você já pesou em vez de violá-los silenciosamente. Se [testes agem como especificações executáveis](/pt/posts/2026-06/tdd-in-the-agent-era/), ADRs agem como *intenção* executável, e um agente que lê ambos trabalha dentro de guardrails reais em vez de improvisar.

## Ferramentas Que Ajudam

Você não precisa de nada sofisticado: um arquivo Markdown e um editor de texto cobrem todo o workflow. Mas algumas ferramentas removem atrito, e menos atrito significa que mais decisões acabam de fato sendo registradas.

Na linha de comando, o [adr-tools](https://github.com/npryce/adr-tools) é um pequeno conjunto de comandos de shell que criam um novo registro, numeram-no, e gerenciam os links de substituição para você. O [Log4brains](https://github.com/thomvaill/log4brains) vai além, adicionando uma CLI e um site estático para que o log de ADRs vire uma base de conhecimento navegável.

Dentro do editor, plugins de IDE mantêm o registro perto de onde você trabalha. As IDEs da JetBrains têm um plugin de ADR que cria e lista registros a partir da visão do projeto, e o VS Code tem extensões como "ADR Manager" e wrappers do "adr-tools" que fazem o mesmo. O objetivo é o mesmo de colocar ADRs no repo: quanto menos você precisar sair do seu fluxo, mais provável que a decisão seja capturada.

E há também as skills de IA. Se você usa um assistente de IA para codar, uma pequena skill ou prompt customizado pode transformar uma discussão de design, uma thread de pull request, ou uma decisão falada em um rascunho de ADR no formato certo, com contexto e consequências já preenchidos. Você ainda revisa e corrige, da mesma forma que revisaria qualquer conteúdo gerado, mas o custo da página em branco cai para quase nada. E como o ADR termina em `docs/adr/`, o assistente o lê de volta depois como contexto. A ferramenta que ajuda você a escrever o registro é a mesma que se beneficia dele.

## Começando Sem Ferver o Oceano

O modo de falha dos ADRs é tratá-los como um projeto de documentação. Não faça isso. Você não escreve retroativamente cinquenta ADRs para uma década de decisões. Você começa a partir de hoje.

1. **Escreva o ADR-0001 sobre usar ADRs.** Sério. O primeiro registro documenta a decisão de manter registros. É um exercício de cinco minutos e define o formato.
2. **Registre a próxima decisão real.** Da próxima vez que uma escolha arquitetural relevante surgir, escreva-a antes de fechar o ticket.
3. **Preencha retroativamente apenas o que está sendo ativamente contestado.** Se uma decisão fica sendo questionada, escreva o ADR que encerra o debate. Ignore o resto.

Em poucos meses você terá um registro de toda escolha significativa feita desde que começou, que é exatamente a janela que importa, porque essas são as decisões ainda frescas o suficiente para serem questionadas.

## Armadilhas Comuns

**Escrevê-los tarde demais.** Um ADR reconstruído pela memória meses depois é ficção. O contexto, as alternativas que você pesou, as restrições que importavam, é exatamente o que se apaga primeiro. Escreva enquanto a decisão está quente.

**Editar decisões em vez de substituí-las.** Se você reescreve o ADR-0003 para refletir uma nova escolha, destruiu a história. Substitua. O raciocínio antigo é dado.

**Deixá-los grandes demais.** Um ADR cobrindo "toda a nossa estratégia de microsserviços" não é um ADR, é um documento de design fantasiado. Uma decisão por registro. Se você não consegue declarar a decisão em uma frase, é mais de uma decisão.

**Pular as consequências.** O contexto e as consequências são onde o valor vive. Um registro que só diz "escolhemos X" sem dizer *por que* e *a que custo* é uma manchete sem o artigo.

## Conclusão

O código diz *o que* o sistema faz. Os testes dizem o que ele *deveria* fazer. Nenhum dos dois diz *por que* ele é construído do jeito que é, e esse "porquê" é a primeira coisa a desaparecer e a mais cara de reconstruir.

ADRs são uma memória para sua arquitetura. São baratos de escrever, vivem junto do código, e sobrevivem à rotatividade do time. O melhor momento para começar foi quando o projeto começou. O segundo melhor momento é a próxima decisão que você tomar.

Escreva. Seu time futuro vai agradecer.

## Referências

- [Desenvolvendo Código na Era dos Agentes](/pt/posts/2026-05/developing-code-in-the-era-of-agents/)
- [TDD na Era dos Agentes](/pt/posts/2026-06/tdd-in-the-agent-era/)
- [Michael Nygard: Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [adr.github.io: organização e ferramentas de ADR](https://adr.github.io/)
- [Joel Parker Henderson: Coleção de Architecture Decision Records](https://github.com/joelparkerhenderson/architecture-decision-record)
