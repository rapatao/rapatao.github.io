---
title: "Destructuring em Kotlin"
date: 2023-11-09T21:00:00Z
tags:
  - kotlin
images:
  - src: "/images/posts/pexels-cottonbro-studio-3944307.jpg"
    alt: "Destructuring em Kotlin"
url: "/pt/posts/2023-11/destructuring-em-kotlin/"
---

**Desestruturação** é um conceito de programação que envolve dividir uma estrutura de dados complexa em seus componentes individuais e atribuir esses componentes a variáveis individuais diretamente em uma única instrução.

Como muitas outras linguagens modernas suportam, mas `Kotlin`, pelo menos quando comparado a `JavaScript`, tem um comportamento diferente quando usado em classes de dados.

O objetivo deste texto é falar sobre essa diferença, e como prevenir, o mais cedo possível, erros que seu uso possa causar ao seu código.

## Understanding Destructuring Declarations

A desestruturação permite decompor um objeto em um conjunto de variáveis. Por exemplo:

```kotlin
data class Item(val name: String, val price: Double)

val rice = User("Rice", 2.13)
val (name, price) = rice
```

Neste código, uma nova instância `Item` foi criada e desestruturada em duas variáveis que representam seus atributos.

Isso foi alcançado usando a seguinte declaração:

```kotlin
val (name, price) = rice
```

Neste caso foi utilizada uma `classe de dados`, mas também é possível utilizá-la em outras estruturas de dados, como Arrays e Listas.

```kotlin
val list = listOf("element 1", "element 2")
val (l1, l2) = list

val array = arrayOf("element 1", "element 2", "element 3")
val (a1, a2) = array
```

Como foi possível notar no exemplo do `array`, não é obrigatório ter todos os elementos atribuídos às variáveis. Valores não mapeados são simplesmente ignorados.

> Importante: mapear mais elementos do que os existentes na lista lançará o `java.lang.ArrayIndexOutOfBoundsException`

## A ordem é importante

A diferença mais significativa entre **desestruturação** em `Kotlin`, quando comparado a `JavaScript` é que a ordem dos elementos é importante.

Em `JavaScript`, assim como em `Kotlin`, a desestruturação de uma coleção é baseada em ordem, o que significa que a primeira declaração de variável será atribuída ao primeiro elemento da coleção, a segunda variável ao segundo elemento e assim por diante …

A diferença entre essas duas linguagens está na desestruturação de objetos, onde em `JavaScript` extrai as propriedades do objeto usando seu nome declarado e `Kotlin` extrai com base na ordem de declaração.

Em `JavaScript`, tendo o seguinte objeto:

```javascript
let rice = {name: "Rice", price: 2.13};
```

É possível destruí-lo usando ambas as instruções, e ambas sempre terão o mesmo resultado:

```javascript
let {name, price} = rice; // name = "Rice", price = 2.13
let {price, name} = rice; // price = 2.13, name = "Rice"
```

Em `Kotlin`, tendo o objeto `Rice`:

```kotlin
data class Item(val name: String, val price: Double)
val rice = User("Rice", 2.13)
```

A ordem da declaração é importante ao desestrutura-la:

```kotlin
val (name, price) = rice // name = "Rice", price = 2.13
val (price, name) = rice // price = "Rice", name = 2.13
```

Como você pode ver, a ordem em que cada atributo do `Item` é declarado impacta diretamente na sua atribuição no momento da desestruturação do mesmo.

## Aplicação de tipo

Como você pode imaginar, isso pode causar algum comportamento indesejado em sua aplicação ao utilizá-la, e você pode estar pensando se é possível mudar seu comportamento, e a resposta é: `não`.

Embora não seja possível alterar, entender esse comportamento pode ajudar a prevenir problemas relacionados a ele, ao ter casos de teste que cobrem explicitamente alterações equivocadas relacionadas aos campos utilizados e também, quando possível, impor o tipo de dados.

A aplicação do tipo de dados torna alterações como essa perceptíveis no momento da compilação.

Ao alterar a atribuição mostrada anteriormente neste texto, você pode ter um erro de compilação caso a classe de dados utilizada tenha sua ordem de campos alterada.

```kotlin
val (name: String, price: Double) = rice // name = "Rice", price = 2.13
```

Portanto, se alguém alterar o `Item` para que o atributo `price` seja declarado primeiro, a digitação não corresponderá e a compilação não será bem-sucedida.

Como você pode imaginar, isso não evitou todos os casos porque se esses dois campos tiverem o mesmo tipo de dados, a compilação será bem-sucedida, pois ainda coincidem. Para casos como este, ter bons casos de teste é a única solução eficaz.

A aplicação do tipo de dados apenas traz ao seu código outra validação, o que pode ser útil e, geralmente, mais fácil de identificar a parte exata do código que foi impactada por uma alteração.

## Usando com sabedoria

Embora as declarações de desestruturação possam tornar o código mais breve e expressivo, evite usá-las em excesso. O uso excessivo pode dificultar a compreensão do código, especialmente para quem não está familiarizado com o recurso.

Sempre priorize a legibilidade e a facilidade de manutenção e lembre-se, só porque você pode, nem sempre significa que deve.

Concluindo, as declarações de desestruturação do Kotlin são uma ótima ferramenta para simplificar seu código e torná-lo mais expressivo quando usado criteriosamente. Eles fornecem uma maneira de desestruturar um objeto em diversas variáveis, tornando o código mais conciso e legível. No entanto, como todas as ferramentas, elas devem ser usadas de forma adequada e com compreensão de sua mecânica subjacente.
