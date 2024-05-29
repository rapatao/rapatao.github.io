---
title: "Otimizando testes em aplicações com Spring Boot"
date: 2021-06-24T22:00:00-03:00
tags:
  - spring
  - springboot
  - java
  - tests
images:
  - "/images/posts/spring-boot-test-performance.png"
url: "/pt/posts/2021-06/otimizando-testes-em-aplicacoes-com-spring-boot/"
aliases:
  - "/posts/2021-06/otimizando-testes-em-aplicacoes-com-spring-boot/"
---

É extremamente comum aplicações construídas com Spring Boot possuir todos seus testes anotados com `@SpringBootTest`, porém é raro encontrar pessoas que sabem a funcionalidade dessa anotação, quando é necessária sua utilização e seu impacto na execução dos testes de uma aplicação.

Você provavelmente deve ter pensado que essa anotação serve para a construção de testes, mas você sabe o que isso representa, o que acontece quando ela é utilizada?

Simploriamente, essa anotação é uma forma simplificada de adicionar uma extensão ao [JUnit](https://junit.org/junit5/docs/current/user-guide/#extensions) que visa inicializar o contexto do Spring antes da execução dos cenários de testes declarados. Com sua utilização, antes de uma classe de teste ser executada, é realizado uma busca na aplicação pela classe anotada com `@SpringBootApplication` para identificar possíveis customizações, carregado as configurações para o perfil de teste (quando não sobrescrito) e somente após o contexto ser inicializado, temos o método com o cenário executado.

Com isso em mente, é interessante saber identificar os possíveis impactos que sua utilização pode trazer aos projetos.

## O impacto da anotação @SpringBootTest

Podemos considerar essa anotação um facilitador para a criação de testes, porém, sua utilização indiscriminada pode adicionar um tempo de execução considerável, pois, conforme descrito anteriormente, diversas operações são realizadas antes da execução dos testes. 

Quando uma aplicação possui poucos cenários de testes, normalmente esse tempo não será notado, mas conforme as aplicações e complexidades das aplicações crescem, diversos novos cenários de testes tendem a serem incluídos, fazendo com que o tempo de execução seja cada vez mais impactante.

Para se ter como referência, foi criado uma aplicação com apenas um componente chamado **que retornará um texto fixo ao ter o método consumido. Essa aplicação pode ser resumida nas seguintes classes: 

```java
@SpringBootApplication
public class TempApplication {

    public static void main(String[] args) {
        SpringApplication.run(TempApplication.class, args);
    }

}

@Service
public class TempService {

    public String get() {
        return "Nothing";
    }
}
```

Normalmente, os testes para a classe `TempService` seria implementado da seguinte maneira:

```java
@SpringBootTest
class TempApplicationTests {

    @Autowired
    private TempService service;

    @Test
    void test() {
        assertEquals("Nothing", service.get());
    }
}
```

Como o uso da anotação `@SpringBootTest`, temos o contexto do *Spring* inicializado em cada teste e esse cenário simples é executado em `233ms`. Esse número pode parecer pouco, mas estamos considerando apenas uma classe de teste com apenas um cenário construído e devemos sempre lembrar que aplicações reais tendem a possuir dezenas de classes com centenas de cenários de testes, o que, teoricamente, faria com que o tempo total de execução seja a multiplicação dessa quantidade.

## Como podemos otimizar os testes?

Como podemos notar, o teste anterior não utiliza nenhum recurso do *Spring*, estávamos utilizando apenas para nos fornecer uma instância da classe `TempService`, algo que poderíamos tranquilamente resolver. Para esse caso em específico, podemos simplesmente remover todas as anotações do Spring e instanciar nossa classe manualmente, onde teríamos a seguinte classe de teste:

```java
class TempApplicationTests {

    private TempService service = new TempService();

    @Test
    void test() {
        assertEquals("Nothing", service.get());
    }

}
```

Com essa alteração, conseguimos obter a mesma cobertura de teste, porém nosso teste é concluído com apenas `15ms`, representando um tempo de execução 15 vezes menor que quando utilizamos as anotações.

## Conclusão

Como podemos notar, cenários simples, onde apenas utilizamos o Spring para injetar nossos componentes, podemos facilmente substituir a utilização das anotações de teste por recursos nativos do Java. Com isso podemos reduzir drasticamente o tempo de execução de nossos testes e quando escalamos isso para aplicações reais, com diversos cenários, poderemos notar uma queda significativa no tempo total de execução dos testes.

Porém, é importante esclarecer que isso não é uma solução que deve ser aplicada para todos os casos, pois sua aplicação pode e provavelmente deve possuir cenários em que seria necessário a utilização do contexto para a construção e execução dos testes. Como exemplo para esses casos, podemos citar testes que visam identificar se todas as dependências para as nossas classes foram providas, testes de mapeamentos e requisições HTTP ou mesmo conexões com bancos de dados.

Enfim, essa abordagem não deve ser seguida para todos os casos, porém com certeza pode ser aplicada em diversos deles e consequentemente traria redução no tempo total de execução dos testes.