---
title: "TDD na Era dos Agentes: Por Que o Desenvolvimento Orientado a Testes Importa Mais do Que Nunca"
date: 2026-06-18T10:00:00Z
tags: [tdd, ai, agents, tests, productivity, architecture]
url: "/pt/posts/2026-06/tdd-in-the-agent-era/"
---

TDD sempre foi difícil de vender. Colegas de equipe reviram os olhos, prazos são culpados, e "a gente adiciona os testes depois" vira o padrão. E então os agentes de IA chegaram, e de repente os argumentos contra o desenvolvimento orientado a testes parecem bem mais fracos.

Há uma armadilha tentadora na era dos agentes: agentes escrevem código rápido, então você entrega rápido, então tudo está bem. Mas velocidade sem direção é só caos em escala. TDD é a direção.

No meu post sobre [desenvolvimento de código na era dos agentes](/pt/posts/2026-05/developing-code-in-the-era-of-agents/), mencionei TDD como um dos principais mecanismos de controle para trabalhar com IA. Este post vai mais fundo, especificamente em como o TDD muda a relação entre desenvolvedor e agente, e por que ignorá-lo é mais arriscado agora do que já foi antes.

## O Que TDD Realmente É (E O Que Não É)

Desenvolvimento Orientado a Testes é uma disciplina, não uma estratégia de testes. O ciclo canônico é simples:

1. **Red**, Escreva um teste que falha e que captura um requisito.
2. **Green**, Escreva o mínimo de código para esse teste passar.
3. **Refactor**, Limpe a implementação mantendo os testes verdes.

O insight crítico é que os testes são escritos *antes* da implementação. Não se trata de métricas de cobertura. Trata-se de se forçar a pensar no problema pela perspectiva do consumidor antes de pensar na solução.

TDD não é:
- Escrever todos os testes no final para atingir uma meta de cobertura.
- Testes unitários isolados com mocks pesados que não refletem a realidade.
- Um ritual burocrático que atrasa a entrega.

Quando bem feito, TDD comprime o tempo de design, reduz debugging, e produz código naturalmente modular e legível, porque código difícil de testar é código difícil de usar.

## O Problema dos Agentes: Confiante e Errado

Agentes de IA são extraordinariamente bons em gerar código plausível. Essa palavra, *plausível*, é o perigo. Um agente não conhece seu domínio. Ele não sabe que sua função `processPayment` nunca deve cobrar um cliente duas vezes em uma condição de corrida. Ele não sabe que sua função `calculateDiscount` deve retornar zero para cupons expirados em vez de um total negativo.

Sem um conjunto de testes que codifica esses requisitos, o agente não tem guardrails. Ele vai produzir código que compila, parece correto, e falha em produção de formas que levam horas para diagnosticar.

Um padrão comum: um agente escreve 200 linhas de implementação em 10 segundos, o desenvolvedor lê, parece razoável, entra no merge. Duas semanas depois, chega um bug report que rastreia até um caso de borda que o agente tratou incorretamente, porque ninguém jamais articulou o que "correto" significa.

TDD força essa articulação *antes* do código existir.

## Testes como Especificações: A Mudança de Modelo Mental

O reframe mais importante para a era dos agentes é este: **testes não são verificação, são especificação.**

Um teste escrito antes da implementação não está verificando código; está definindo um contrato. Considere este exemplo:

```kotlin
@Test
fun `desconto deve ser zero para cupom expirado`() {
    val coupon = Coupon(code = "SAVE10", expiresAt = yesterday())
    val result = calculateDiscount(price = 100.0, coupon = coupon)
    assertEquals(0.0, result)
}

@Test
fun `desconto deve ser aplicado corretamente para cupom válido`() {
    val coupon = Coupon(code = "SAVE10", discount = 0.10, expiresAt = tomorrow())
    val result = calculateDiscount(price = 100.0, coupon = coupon)
    assertEquals(10.0, result)
}
```

Esses dois testes dizem tudo sobre o comportamento esperado. Eles definem a interface, as entradas, as saídas e os casos de borda. Quando entregues a um agente com a solicitação de escrever a implementação, não há adivinhação envolvida, isso é uma especificação legível por máquina.

O agente se torna um gerador de código operando dentro de restrições definidas. Essa é uma relação fundamentalmente diferente, e muito mais segura, do que "escreva uma função de cálculo de desconto."

## O Workflow: TDD com um Agente

Este é o workflow que consistentemente produz resultados melhores do que deixar o agente conduzir desde o início:

### 1. Gere os Testes, Depois Revise-os Profundamente

Um agente pode gerar os casos de teste iniciais, e isso é um uso legítimo da ferramenta. Peça para ele enumerar cenários baseados nos seus requisitos. O agente vai cobrir os caminhos óbvios rapidamente.

O passo crítico, porém, é a revisão humana. Antes de qualquer implementação ser escrita, passe por cada teste gerado e pergunte:

- Este teste reflete o que o sistema *deve* fazer, ou apenas o que pareceu natural gerar?
- Há casos de borda específicos do domínio que o agente não poderia conhecer?
- Algum dos testes contradiz outro?
- Há cenários ausentes que o agente não pensou em cobrir?

Este é o passo onde o conhecimento de domínio prova seu valor. O agente produz um rascunho de especificação; o desenvolvedor valida e completa. Somente após essa revisão a implementação deve começar.

### 2. Peça ao Agente para Criticar os Testes

Antes de partir para a implementação, direcione o agente aos próprios testes: *"Revise esses testes. Há casos não cobertos? Há requisitos que esses testes implicam que parecem incompletos ou contraditórios?"*

Agentes conseguem identificar lacunas, apontar assertions ambíguas e sinalizar casos onde dois testes codificam comportamentos conflitantes. Essa segunda passagem, agente revisando testes gerados por agente, com supervisão humana, frequentemente revela problemas que uma única geração não detecta.

### 3. Deixe o Agente Implementar Contra os Testes

Agora entregue os testes revisados ao agente e peça uma implementação que faça todos passarem. O agente tem restrições. Tem uma definição de "pronto." Não pode derivar para construir funcionalidades que não foram pedidas, porque os testes dizem exatamente como o sucesso parece.

Execute os testes. Se falharem, alimente a saída de falha de volta ao agente. O conjunto de testes é o feedback loop que mantém o agente no caminho certo.

### 4. Refatore Juntos

Uma vez verdes, refatore. Peça ao agente para sugerir melhorias, nomes melhores, lógica mais simples, duplicação reduzida. Como os testes existem, mudanças de refatoração podem ser aceitas com confiança. Os testes vão capturar qualquer regressão.

## A Qualidade dos Testes Também Importa

Um conjunto de testes fraco é pior do que nenhum conjunto de testes neste contexto, porque cria falsa confiança. Se os testes só exercem o caminho feliz, um agente vai produzir uma implementação que os passa, e falha em todo o resto.

Duas coisas importam mais para a qualidade dos testes em um workflow assistido por agente:

**Assertions significativas.** Um teste que verifica se um método foi chamado, mas não o que ele retornou, não é uma especificação, é uma sombra. Prefira verificar saídas e estado em vez de interações.

**Cuidado com flaky tests.** Um agente que vê falhas intermitentes vai ignorá-las ou contorná-las de formas imprevisíveis. No meu post sobre [o que são flaky tests e por que corrigi-los](/pt/posts/2022-08/o-que-sao-flaky-tests-e-porque-corrigi-los/), abordei como o comportamento não determinístico degrada a confiança em um conjunto de testes, na era dos agentes, essa erosão de confiança é ainda mais custosa porque corrompe o feedback loop que mantém o código gerado honesto.

## Por Que Isso Importa para a Manutenibilidade no Longo Prazo

A era dos agentes cria um novo risco: **velocidade sem disciplina.** Agentes tornam trivial a geração de código, o que torna tentador pular o pensamento que deveria precedê-la.

Um codebase construído sem TDD é um codebase onde a única documentação do comportamento pretendido é o próprio comportamento. Quando esse comportamento é gerado por um agente, você tem um sistema onde ninguém, nem o desenvolvedor nem a ferramenta, definiu explicitamente o que "correto" significa.

TDD constrói uma especificação viva. Cria um conjunto de testes que serve como documentação executável: execute-o e você sabe se o sistema se comporta como pretendido. À medida que o codebase cresce e agentes são solicitados a modificar ou estender funcionalidades, o conjunto de testes age como uma rede de segurança. Qualquer regressão é capturada imediatamente. O custo de mudança permanece baixo.

Considere o que acontece quando um agente é solicitado a refatorar um módulo grande daqui a seis meses. Sem testes, o agente não tem como verificar que não quebrou nada. Com testes, a refatoração tem um critério objetivo de sucesso. O agente executa a suíte, vê uma falha, corrige, executa novamente. A confiança vem de evidências, não de ler código gerado e torcer pelo melhor.

Sobre a performance dos testes, testes lentos desestimulam o ciclo apertado de red-green-refactor que torna o TDD eficaz. No meu post sobre [otimização de testes em aplicações Spring Boot](/pt/posts/2021-06/otimizando-testes-em-aplicacoes-com-spring-boot/), compartilhei técnicas que mantêm o feedback loop rápido sem sacrificar a cobertura.

## Objeções (E Por Que Estão Erradas na Era dos Agentes)

**"TDD atrasa o desenvolvimento."**

Talvez atrasasse quando cada linha de implementação tinha que ser escrita à mão. Na era dos agentes, a fase de implementação é quase gratuita. A parte cara é descobrir o que construir. TDD é exatamente isso, pensamento estruturado sobre o que construir. O custo foi efetivamente eliminado do lado errado da equação.

**"Agentes também escrevem testes, então é só pedir que façam tudo de uma vez."**

Agentes que geram testes e implementação simultaneamente estão corrigindo sua própria prova. Os testes vão passar porque o agente os escreve para corresponder à implementação que já tem em mente, não porque a implementação está correta. Gerar os testes primeiro e revisá-los independentemente quebra esse ciclo. O resultado é uma especificação que o agente não teve participação em validar.

**"O projeto avança rápido demais para TDD."**

Projetos que avançam rápido acumulam dívida técnica rápido. Sem um conjunto de testes, cada mudança assistida por agente é uma aposta. A velocidade ganha hoje é emprestada contra o debugging que vem no próximo trimestre.

## Conclusão

TDD sempre foi uma boa ideia. Na era dos agentes, é uma necessária.

Agentes são poderosos porque podem gerar grandes quantidades de código rapidamente. São perigosos pelo mesmo motivo. O conjunto de testes é o mecanismo que transforma um agente de uma fonte de código plausível em uma fonte de código *verificado*.

Gere os testes, revise-os profundamente, deixe o agente implementar, verifique, refatore, repita. Este não é um workflow do passado que por acaso ainda funciona, é uma disciplina que sempre apontou para este momento.

Os desenvolvedores que prosperam na era dos agentes não serão os que digitam menos caracteres. Serão os que pensam mais claramente sobre como o comportamento correto deve ser antes de qualquer implementação ser gerada.

## Referências

- [Desenvolvendo Código na Era dos Agentes](/pt/posts/2026-05/developing-code-in-the-era-of-agents/)
- [O que são Flaky Tests e por que corrigi-los](/pt/posts/2022-08/o-que-sao-flaky-tests-e-porque-corrigi-los/)
- [Construindo testes com Kotlin, JUnit e MockK](/pt/posts/2022-01/construindo-testes-com-kotlin-junit-mockk/)
- [Otimizando testes em aplicações Spring Boot](/pt/posts/2021-06/otimizando-testes-em-aplicacoes-com-spring-boot/)
- [Test-Driven Development: By Example, Kent Beck](https://www.oreilly.com/library/view/test-driven-development/0321146530/)
- [Martin Fowler on TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html)