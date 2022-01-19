---
title: "Verificação de varargs utilizando Mockito"
date: 2020-05-14T00:00:00-03:00
tags:
    - java
    - mockito
    - junit
    - tests
images: 
  - src: "/img/posts/pexels-christina-morillo-1181244.jpg"
    alt: "java code"
    stretch: "vertical"
url: "/pt/posts/2020-05/verify-varargs-using-mockito/"    
---

Construir testes é uma das tarefas mais rotineiras de um desenvolvedor e normalmente, com frameworks como jUnit e Mockito, esta tarefa tende a ser realizada sem grandes dificuldades. Apesar disso, existem certas validações, que costumam ter maior complexidade, como exemplo, verificação de chamadas a métodos com parâmetros to tipo *varargs*.

Caso não saiba o que é *varargs*, pode-se dizer grosseiramente que é, o "..." utilizado nas declarações de parâmetros em métodos, porém, recomendo ler [este artigo](https://www.geeksforgeeks.org/variable-arguments-varargs-in-java/) para melhor entendimento e visualização de exemplos.

Apesar de não ter alta complexidade, nem sempre temos controle sobre como as implementações serão invocadas, principalmente quando utilizamos frameworks que fazem utilização de conceitos como *callbacks* ou mesmo *reflection*, muito utilizado no framework Spring.

Considere a seguinte declaração de classe:

```java
class Varargs {

    public void consume(String... values) {
        System.out.println(String.join(", ", values));
    }

}
```

Devemos considerar que a classe *Varargs* será invocada por algum *framework* do qual não possuímos controle, porém, precisamos garantir que, conhecendo o valor de entrada, os valores a serem recebidos na implementação, também serão conhecidos.

Para tentar exemplificar um cenário, podemos considerar que o framework irá converter valores da resposta do consumo de uma *API REST*, realizar cálculos e consumir a implementação com o resultado dessa operação.

Apesar de não podermos controlar as operações realizadas por esse framework, podemos manipular a execução, enviando valores conhecidos e validando se o consumo da implementação será feito como esperado.

`Este tipo de teste é muito útil para garantir que atualizações deste framework, não comprometa o comportamento de nossa aplicação, possibilitando atualizações constantes e seguras.`

Imaginando que o framework em utilização possua uma classe da qual não temos como controlar, exemplificado abaixo pela classe *Invoker* com modificador *final*, devemos garantir que após a operação, ao ser invocado o método da classe *Varargs*, os mesmo argumentos sejam sempre recebidos, baseando-se nos parâmetros de entrada.

```java
final class Invoker {

    private final Varargs varargs;

    public Invoker(Varargs varargs) {
        this.varargs = varargs;
    }

    public void invoke(String... values) {
        final var newValue = new ArrayList<>(Arrays.asList(values));
        newValue.add(0, String.valueOf(values.length));
        varargs.consume(newValue.toArray(new String[0]));
    }

}
```

Considerando tudo que foi dito acima, segue alguns exemplos de utilização da nossa implementação pela classe *Invoker*:

```java
final var varargs = new Varargs();
final var invoker = new Invoker(varargs);

invoker.invoke();
// 0
invoker.invoke("1");
// 1, 1
invoker.invoke("1", "2");
// 2, 1, 2
```

Dada a contextualização, segue implementação de teste para validação do cenário:

```java
@Test
public void testNoArgument() {
    final var varargs = Mockito.spy(new Varargs());

    new Invoker(varargs).invoke();

    final var stringArgumentCaptor = ArgumentCaptor.forClass(String.class);
    verify(varargs).consume(stringArgumentCaptor.capture());

    assertThat(stringArgumentCaptor.getAllValues(), hasSize(1));
    assertThat(stringArgumentCaptor.getAllValues(), containsInRelativeOrder("0"));
}

@Test
public void testSingleArgument() {
    final var varargs = Mockito.spy(new Varargs());

    new Invoker(varargs).invoke("1");

    final var stringArgumentCaptor = ArgumentCaptor.forClass(String.class);
    verify(varargs).consume(stringArgumentCaptor.capture());

    assertThat(stringArgumentCaptor.getAllValues(), hasSize(2));
    assertThat(stringArgumentCaptor.getAllValues(), containsInRelativeOrder("1", "1"));
}

@Test
public void testTwoArguments() {
    final var varargs = Mockito.spy(new Varargs());

    new Invoker(varargs).invoke("1", "2");

    final var stringArgumentCaptor = ArgumentCaptor.forClass(String.class);
    verify(varargs).consume(stringArgumentCaptor.capture());

    assertThat(stringArgumentCaptor.getAllValues(), hasSize(3));
    assertThat(stringArgumentCaptor.getAllValues(), containsInRelativeOrder("2", "1", "2"));
}
```

Assim conseguimos garantir que, quando o *Invoker* receber determinados parâmetros de entrada, o *Varargs* irá sempre ser consumida com os mesmos valores.

Apesar de o exemplo aqui não ser de um cenário real, acredito que ele possa ser facilmente adaptado para vários casos, servindo assim como referência.

Caso tenha dúvidas ou sugestões, não hesite em entrar em contato!
