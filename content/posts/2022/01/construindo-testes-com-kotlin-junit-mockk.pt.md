---
title: "Construindo testes com Kotlin, JUnit e MockK"
date: 2022-01-19T22:00:00-03:00
tags:
  - kotlin
  - junit
  - mockk
  - tests
url: "/pt/posts/2022-01/construindo-testes-com-kotlin-junit-mockk/"
aliases:
  - "/pt/posts/2022-01/construindo-testes-com-kotlin-junit-mockk/"
---

A construção de testes de código em uma aplicação tem como principal objetivo certificar o que foi codificado, ou seja,
garantir que um determinado trecho de código faz o que deveria fazer.

[JUnit](https://junit.org/junit5/) é um dos frameworks mais utilizados na construção de testes
em [Kotlin](https://kotlinlang.org/) e [MockK](https://mockk.io/) para construção de *mocks*, que seriam como dublês de
um objeto e tem como função simular o comportamento de um componente.

<aside>
💡 Os código utilizados nesse texto estão disponíveis no GitHub: https://github.com/rapatao/blog-koltin-junit-mockk

</aside>

## Dependências utilizadas

É importante dizer que, existem diversas formas de adicionar suporte a linguagem e frameworks que iremos utilizar neste
texto. No exemplo abaixo, será apresentado apenas uma delas, sendo basicamente como o
*[IntelliJ IDEA](https://www.jetbrains.com/idea/)* inicializa projetos em *Kotlin* + *[Gradle](https://gradle.org/)*.

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "1.6.10"
}
...
dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
    testImplementation("org.junit.jupiter:junit-jupiter:5.8.2")
    testImplementation("io.mockk:mockk:1.12.2")
}
...
test {
    useJUnitPlatform()
}
```

Antes de adicionar essas configurações ao seu projeto, é sempre importante verificar se as mesmas já não estão presentes
em seu projeto. Isso pode ser feito através da *task* `:dependencies`, tanto através de alguma IDE como por terminal,
com o seguinte comando:

```bash
$ gradle dependencies
```

Com o resultado do comando, basta procurar pelas dependências, se as encontrar, sua configuração está correta.

## O código a ser testado

Como a ideia principal é demonstrar a construção de testes utilizando *Kotlin*, *JUnit* e *MockK*, o código utilizado é
extremamente simples, porém através dele será possível demonstrar não só a criação de testes utilizando *JUnit*, como a
construção de *mocks* através de *MockK*, entre outros detalhes que iremos detalhar no decorrer do texto.

***CalculatorService.kt***

```kotlin
class CalculatorService {
    fun sum(a: Int, b: Int) = a + b
    fun multi(a: Int, b: Int) = a * b
}
```

***OpType.kt***

```kotlin
enum class OpType {
    SUM, MULTI
}
```

***MainService.kt***

```kotlin
class MainService(
    private val calculatorService: CalculatorService
) {
    fun execute(a: Int, b: Int, op: OpType) =
        when (op) {
            OpType.SUM -> calculatorService.sum(a, b)
            OpType.MULTI -> calculatorService.multi(a, b)
        }
}
```

## O primeiro teste

A declaração de testes com *JUnit* é feito através da anotação `org.junit.jupiter.api.Test`adicionada em uma função que
descreve o cenário a ser executado, conforme exemplo:

```kotlin
import org.junit.jupiter.api.Test

internal class ClassTest {

    @Test
    fun test() {
        // test block
    }

}
```

De maneira geral, todo teste verifica se algo ocorreu conforme esperado. Existem diversas formas se fazer isso, mas são
normalmente feitas através dos métodos existentes na classe `org.junit.jupiter.api.Assertions`, como, por exemplo, o
`assertEquals`. Outros métodos existem, e podem ser
verificados [aqui](https://junit.org/junit5/docs/current/api/org.junit.jupiter.api/org/junit/jupiter/api/Assertions.html).

Com base no código apresentado anteriormente, podemos criar alguns cenários de testes, porém irei descrever apenas dois,
que irão basicamente realizar testes simples com as operações `SUM` e `MULTI`.

```kotlin
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class SimpleTest {

    @Test
    fun `o resultado de 2+3 deve ser 5`() {
        val calculatorService = CalculatorService()
        val mainService = MainService(calculatorService)

        val result = mainService.execute(2, 3, OpType.SUM)

        assertEquals(5, result)
    }

    @Test
    fun `o resultado de 2*3 deve ser 6`() {
        val calculatorService = CalculatorService()
        val mainService = MainService(calculatorService)

        val result = mainService.execute(2, 3, OpType.MULTI)

        assertEquals(6, result)
    }

}
```

Apesar de simples, esses testes demonstram como é realizado a construção de testes, que basicamente consiste em, criar
as instâncias necessárias, invocar a função a ser testada e comparado seu resultado.

## Reduzindo código duplicado nos testes

Como pode ser notado, ambos cenários realizam a construção de uma instância da classe a ser testada e, consequentemente,
de suas dependências. Com o *JUnit*, casos assim, poderiam ser construído declarando uma função anotações especificas,
executadas antes ou após um, ou todos os cenários de testes declarados.

Essas anotações são utilizadas quando precisamos preparar ou remover dados antes ou depois da execução dos cenários de
testes, como, por exemplo, realizar inserção de dados em uma base de dados, ou apagar informações inseridas nesta mesma
base.

As anotações existentes e seus comportamentos são descritos a seguir:

- `org.junit.jupiter.api.BeforeAll`: Executa **antes** de **todos** os cenários de teste
- `org.junit.jupiter.api.AfterEach`: Executa **antes** de **cada** cenário de teste
- `org.junit.jupiter.api.AfterEach`: Executa **depois** de **cada** cenário de teste
- `org.junit.jupiter.api.AfterAll`: Executa **depois** de **todos** os cenários de testes

Conhecendo essas anotações, podemos reescrever os cenários anteriores da seguinte maneira:

```kotlin
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

internal class WithBeforeTest {

    private lateinit var calculatorService: CalculatorService
    private lateinit var mainService: MainService

    @BeforeEach
    fun setup() {
        calculatorService = CalculatorService()
        mainService = MainService(calculatorService)
    }
    ...
}
```

## Simulando chamadas em outras classes

Muitos testes podem ser construídos com utilização de dependências "reais", ou seja, com suas instâncias, porém, alguns
casos isso pode não ser possível, uma vez que essas instâncias podem necessitar ou acessar recursos que não estão
disponíveis durante a execução dos testes.

Nesses casos, utilizamos ferramentas que criam *mocks*, que podem ser entendidos como instâncias que simulam o
comportamento de uma instância real. Essa simulação é normalmente declarada explicitamente e seria algo como: "quando o
método A for invocado com determinados parâmetros, B deverá ser retornado".

Utilizando nossas classes de exemplo, podemos escrever os testes da seguinte maneira:

```kotlin
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

internal class WithBeforeTest {

    private lateinit var calculatorService: CalculatorService
    private lateinit var mainService: MainService

    @BeforeEach
    fun setup() {
        calculatorService = mockk()
        mainService = MainService(calculatorService)
    }

    @Test
    fun `o resultado de 2+3 deve ser 5`() {
        every { calculatorService.sum(any(), any()) } returns 5

        val result = mainService.execute(2, 3, OpType.SUM)

        Assertions.assertEquals(5, result)
    }

    @Test
    fun `o resultado de 2*3 deve ser 6`() {
        every { calculatorService.multi(any(), any()) } returns 6

        val result = mainService.execute(2, 3, OpType.MULTI)

        Assertions.assertEquals(6, result)
    }
}
```

Note que, agora antes de invocar o método `execute`, dizemos como o *mock* deve se comportar ao ser consumido. Apesar de
não tem muito sentido em nosso exemplo, considerado a simplicidade de nosso código, isso pode ser extremamente útil
quando precisamos simular o uso de um *SDK* terceiro que não fornece meios para criação de testes, o que poderia
impossibilitar a criação de testes, caso não seja utilizado *mocks.*

## Criando mocks com anotações

O framework *MockK*, fornece um conjunto de anotações que podem ser utilizadas para criação dos *mocks* e os injetar na
classe a ser testada, sem que esse processo seja explicitamente realizado. Esse recurso é útil quando necessitamos criar
diversos *mocks* para construção dos testes e sua construção é feita através da adição de anotações
`io.mockk.impl.annotations.MockK` e `io.mockk.impl.annotations.InjectMockKs` nas variáveis declaradas na classe de
teste.

Após isso, devemos alterar no método `setup` para inicializar essas variáveis, como podemos ver seguir:

```kotlin
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

internal class WithMockKAnnotationTest {

    @MockK
    private lateinit var calculatorService: CalculatorService

    @InjectMockKs
    private lateinit var mainService: MainService

    @BeforeEach
    fun setup() {
        MockKAnnotations.init(this)
    }
    ...
}
```

## Reduzindo código na criação de mocks

O JUnit oferece um recurso interessante chamado de
*[Extensions](https://junit.org/junit5/docs/current/user-guide/#extensions)*. Com esse recurso, podemos estender o
comportamento do framework de testes, delegando diversos comportamentos que possa ser necessário para a execução dos
cenários de testes.

Frameworks populares como *Spring*, através da `@SpringBootTest` e *Micronaut*, com `@MicronautTest`fazem uso desse
recurso para inicializar o contexto antes da execução dos cenários.

O framework *MockK* também oferece suporte a esse recurso, porém, não utilizando uma anotação específica, mas sim, por
uma declaração explicita do recurso do JUnit, que consiste em adicionar a seguinte anotação a classe dos testes:

```kotlin
@org.junit.jupiter.api.extension.ExtendWith(MockKExtension::class)
```

Com sua utilização, não precisamos mais, em nossa classe de teste, não precisamos mais declara o método `setup`,
deixando nossa classe de teste da seguinte maneira:

```kotlin
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(MockKExtension::class)
internal class WithMockKExtensionTest {

    @MockK
    private lateinit var calculatorService: CalculatorService

    @InjectMockKs
    private lateinit var mainService: MainService

    ...
}
```

## Conclusão

Nesse texto abordamos as dependências necessárias para construção de testes com Kotlin, utilizando as ferramentas JUnit
e MockK. Descrevemos também como construir métodos, executados antes e depois dos casos de testes, bem como a criação de
*mocks* para casos onde não podemos utilizar uma implementação real.

Espero que tenha ajudado a compreender como construir testes utilizando essas ferramentas, bem como a otimizar sua
construção, demonstrando como reduzir a quantidade de código necessário para construção dos casos de testes.

Agradeço a leitura e sinta-se a vontade em questionar sobre o assunto.