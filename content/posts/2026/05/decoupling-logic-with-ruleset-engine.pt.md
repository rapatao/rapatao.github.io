---
title: "Desacoplando Lógica com Ruleset Engine: Uma Abordagem Leve para a JVM"
date: 2026-05-23T10:00:00Z
tags: [kotlin, java, architecture]
url: "/pt/posts/2026-05/desacoplando-logica-ruleset-engine/"
---

Tudo começou com um pedido simples: *"Se o usuário for um membro premium, dê a ele frete grátis".* Adicionamos um rápido `if`, e tudo estava bem. Um mês depois, tornou-se: *"Se ele for premium OU tiver mais de 500 pontos, mas apenas se estiver no Brasil".* Depois veio a complexidade real: verificações de status ativo, exclusões baseadas em tags, mínimos de pedido e requisitos de fidelidade.

Antes que percebêssemos, nossa lógica de negócio principal estava enterrada sob uma montanha de blocos `if/else` aninhados. O que antes era um código limpo tinha se transformado em um "pesadelo de regras"—difícil de ler, impossível de testar e aterrorizante de mudar. Todos nós já passamos por isso, encarando um bloco condicional de 50 linhas, imaginando onde foi que erramos.

Esta é a história de como paramos de codificar regras fixas e começamos a usar o **Ruleset Engine**.

## O Ponto de Ruptura

O problema com regras fixas no código (hardcoded) não é apenas o "código espaguete". É a falta de agilidade. Toda vez que um analista de negócio queria ajustar um requisito de elegibilidade, tínhamos que passar por um ciclo completo de desenvolvimento: codificar, testar, revisar e publicar. Nós éramos o gargalo.

Precisávamos de uma maneira de desacoplar o *quê* (as regras de negócio) do *como* (o código da aplicação). Precisávamos de algo leve, flexível e nativo para a JVM.

## Conheça o Ruleset Engine

O [Ruleset Engine](https://github.com/rapatao/ruleset-engine) foi projetado exatamente para esse cenário. Ele permite externalizar sua lógica em dados (como JSON) ou defini-la usando um DSL Kotlin fluente que até mesmo um não-desenvolvedor quase consegue entender.

### Passo 1: Falando a Língua

Em vez de escrever condicionais complexos, começamos a construir regras. Usando o DSL Kotlin, nossa lógica de elegibilidade começou a ficar assim:

#### Antes: O habitual if/else

```kotlin
val isEligible = user != null 
    && (user.isPremium || (user.points != null && user.points > 500 && user.location == "BR")) 
    && user.active 
    && user.tags?.contains("blocked") == false
    && user.middleName == null
    && (order != null && (order.total > 100 || user.yearsOfLoyalty >= 2))

if (isEligible) {
    applyDiscount()
}
```

Embora pareça gerenciável com algumas linhas, imagine adicionar mais cinco condições ou blocos "OR" aninhados. Torna-se rapidamente um pesadelo de legibilidade e propenso a erros de lógica—especialmente quando você precisa lidar manualmente com cada possível "null pointer".

#### Depois: O DSL do Ruleset Engine

```kotlin
import com.rapatao.projects.ruleset.engine.types.builder.*

val eligibilityRule = allMatch(
    anyMatch(
        "user.isPremium" equalsTo true,
        allMatch(
            "user.points" greaterThan 500,
            "user.location" equalsTo "BR"
        )
    ),
    "user.active" equalsTo true ifFail OnFailure.FALSE,
    "user.tags" notContains "blocked",
    "user.middleName" equalsTo null, // Verificação explícita de nulo
    anyMatch(
        "order.total" greaterThan 100,
        "user.yearsOfLoyalty" greaterOrEqualThan 2
    ) ifFail OnFailure.FALSE
)
```

> **Nota sobre Resiliência:** Observe que o `ifFail` está posicionado no próprio bloco `anyMatch`. Isso replica o comportamento de curto-circuito nativo: se o `order` for nulo, a avaliação de `"order.total"` falha, fazendo com que todo o grupo retorne `FALSE`—exatamente como `order != null && (...)`. Se tivéssemos colocado o `ifFail` apenas na expressão do total, a engine teria continuado a verificar os pontos de fidelidade mesmo se o pedido estivesse ausente!

À primeira vista, pode parecer mais verboso do que uma única linha de lógica booleana. No entanto, essa abordagem estruturada é significativamente mais fácil de ler e manter à medida que as regras crescem. Ela fornece uma visão clara e hierárquica dos requisitos de negócio, tornando-a muito mais acessível para não-desenvolvedores—como analistas de negócio ou product owners—entenderem e verificarem a lógica sem a necessidade de interpretar códigos complexos.

Não era mais apenas código; era documentação.

## Lidando com o Inesperado: Resiliência por Design

No mundo real, os dados raramente são perfeitos. Um campo ausente ou um "null pointer" nos seus dados de entrada pode facilmente quebrar um bloco `if/else` tradicional.

O Ruleset Engine oferece uma maneira robusta de lidar com essas falhas através da estratégia `OnFailure`. Você pode definir exatamente como uma expressão deve se comportar quando uma avaliação falha:
- **`THROW` (Padrão)**: Relança a exceção, garantindo que você não perca nenhum erro crítico.
- **`TRUE`**: Ignora a falha e trata o resultado da expressão como `true`.
- **`FALSE`**: Ignora a falha e trata o resultado da expressão como `false`.

Isso permite que você construa regras resilientes que podem lidar com dados imperfeitos sem derrubar sua aplicação. É particularmente poderoso para **verificações de nulos profundas**: onde um `if` nativo exigiria `order != null && order.total > 100`, a engine permite que você simplesmente defina o caminho e lide com a falha de forma elegante.

Usando a extensão `ifFail`, é tão simples quanto:

```kotlin
import com.rapatao.projects.ruleset.engine.types.OnFailure
import com.rapatao.projects.ruleset.engine.types.builder.extensions.ifFail

// Se o campo estiver ausente, trata a regra como false em vez de lançar um NullPointerException
val rule = "user.optional.age" greaterThan 18 ifFail OnFailure.FALSE
```

### Passo 2: Avaliando a Verdade

Avaliar essas regras tornou-se uma brisa. Poderíamos passar um Map, um POJO ou até mesmo uma Data Class complexa, e a engine nos diria a verdade:

```kotlin
val evaluator = KotlinEvaluator()
val context = mapOf("user" to currentUser)

if (evaluator.evaluate(shippingRule, context)) {
    applyFreeShipping()
}
```

### Passo 3: Indo para a Nuvem (ou apenas um JSON)

A real "mágica"—e onde reside o verdadeiro poder dessa abordagem—aconteceu quando removemos essas regras inteiramente do código. Como o Ruleset Engine suporta Jackson, pudemos armazenar essas regras em nosso banco de dados ou em um serviço de configuração como JSON:

```json
{
  "allMatch": [
    {
      "anyMatch": [
        { "left": "user.isPremium", "operator": "equals", "right": true },
        {
          "allMatch": [
            { "left": "user.points", "operator": "greater_than", "right": 500 },
            { "left": "user.location", "operator": "equals", "right": "BR" }
          ]
        }
      ]
    },
    { "left": "user.active", "operator": "equals", "right": true, "onFailure": "FALSE" },
    { "left": "user.tags", "operator": "not_contains", "right": "blocked" },
    { "left": "user.middleName", "operator": "equals", "right": null },
    {
      "anyMatch": [
        { "left": "order.total", "operator": "greater_than", "right": 100 },
        { "left": "user.yearsOfLoyalty", "operator": "greater_or_equal_than", "right": 2 }
      ],
      "onFailure": "FALSE"
    }
  ]
}
```

Ao externalizar as regras do código, desbloqueamos um novo nível de agilidade. De repente, a equipe de produto podia alterar a lógica de validação ou atualizar as regras de negócio sem a necessidade de uma nova versão do código ou de um deploy completo. Isso tornou a resposta às mudanças do mercado mais simples e significativamente mais rápida. Mudar uma regra não era mais uma tarefa de desenvolvimento; era uma atualização de configuração.

## O Resultado: Agilidade Recuperada

Ao adotar o Ruleset Engine, não apenas limpamos nosso código. Mudamos a maneira como trabalhamos. Deixamos de ser os "guardiões da lógica" para nos tornarmos os "construtores da plataforma". O negócio podia iterar mais rápido, e nós pudemos dormir melhor sabendo que nossa lógica principal não era mais um castelo de cartas.

Se o seu projeto está começando a sentir o peso de seus próprios comandos "if", talvez seja hora de contar uma história diferente com o Ruleset Engine.

> **Nota:** Este post foi escrito utilizando a versão 1.6.0 do Ruleset Engine.

## Referências
- [Repositório GitHub do Ruleset Engine](https://github.com/rapatao/ruleset-engine)
- [Documentação Oficial](https://github.com/rapatao/ruleset-engine#usage)
