---
title: "Programação reativa com Spring WebFlux, devo utilizar?"
date: 2020-07-26T19:33:23-03:00
tags:
    - spring mvc
    - spring webflux
    - reactive
images: 
  - src: "/images/posts/abandoned-antique-architecture-building-277782.jpg"
    alt: "Webflux ou MVC?"
    stretch: "vertical"
url: "/pt/posts/2020-07/should-i-use-spring-webflux/"
---

**Devo utilizar?**

    Não, mas pode ser que sim!

Eu poderia parar o artigo aqui, mas isso não iria agregar em nada e você jamais iria entender o motivo de eu começar o texto com um **não, mas pode ser que sim**. A verdade é que se você espera utilizar *WebFlux* e resolver todos os seus problemas, sinto lhe dizer que seus problemas podem estar só começando.

Recentemente o assunto *Vantagens e Desvantagens sobre o WebFlux* surgiu em meu trabalho e por ter pouca experiência utilizando *WebFlux*, resolvi buscar mais informações sobre o assunto e pretendo descrever aqui minha opinião sobre a utilização de *WebFlux* e por consequência, um pouco sobre programação reativa.

Tem alguns anos que programação reativa está em alta e fala-se muito sobre ganhos de performance, otimização de recursos, mas a discussão sobre o assunto ainda está muito rasa e por vezes com ar de puro modismo.

Quando se pesquisa sobre a performance de aplicações reativas, acabamos vendo gráficos maravilhosos, como se todos os problemas fossem resolvidos com uma simples migração de paradigma, mas muitas vezes não notamos que as comparações acabam sendo um tanto quanto estranhas quando comparadas com aplicações "reais".

Me refiro ao fato destes testes considerarem uma migração completa da arquitetura da aplicação, ou seja, do código ao banco de dados, e isso normalmente não é uma opção, pois nem sempre podemos substituir nosso banco de dados, por exemplo, do *MySQL* para *MongoDB* ou *Cassandra*. Isso, para mim, faz com que os resultados destes comparativos sejam vistos com uma certa ponderação.

Porém, antes de realizarmos qualquer mudança no código, devemos sempre responder alguns questionamentos que considero fundamentais para o sucesso de tarefas deste nível.

* O time tem conhecimento sobre a tecnologia que será utilizada?
  * Caso negativo, o time terá tempo hábil para aprender a nova tecnologia?
* O time entende as vantagens, desvantagens e riscos desta tecnologia?
* A nova tecnologia é compatível com as outras ferramentas utilizadas? Ex.: Banco de dados.

É sempre importante responder estas questões antes de iniciar um projeto com adoção de uma tecnologia diferente da habitual. Isso ajuda a prevenir riscos inesperados e possíveis atrasos nas entregas.

Nós desenvolvedores temos muitas vezes o desejo de utilizar algo novo/diferente em nossas tarefas do dia a dia, porém é sempre importante ponderarmos o que isso irá agregar, com dificuldade, curva de aprendizado e riscos inerentes a essa adesão.

**Voltando ao assunto principal, *Spring WebFlux*...**

![Voltando ao tópico](/images/posts/green-typewriter-on-brown-wooden-table-4052198.jpg#center)

Dentre tudo que li e tive oportunidade de ver na prática, achei bem interessante a eficiência das aplicações construídas com *WebFlux*. Foi o famoso “muito com pouco”, porém me chamou atenção a complexidade em se construir testes unitários/integrados bem como a dificuldade na realização de *debug*, visto que o fluxo de chamadas não é mais, por assim dizer, sequencial.

Entre os diversos artigos que li, havia diversos relatos de pessoas que afirmavam categoricamente que o *WebFlux* era melhor pois era possível realizar processamento das requisições em paralelo, enquanto no modelo utilizado pelo *Spring MVC*, somente uma requisição era realizada por vez, o que não é verdadeiro, visto que o paralelismo é criado com *threads* e controlado pelos servidores de aplicação, como por exemplo, *Tomcat* e *Jetty*.

**Enfim, devo utilizar *WebFlux* em meu projeto?**

![Voltando ao tópico](/images/posts/banking-business-checklist-commerce-416322.jpg#center)

Bom, isso depende…

O fato da aplicação ser construída utilizando um paradigma reativo (*WebFlux*) não faz com que ela tenha uma performance superior ao modelo imperativo (*Spring MVC*). Muitas vezes o problema na performance pode estar simplesmente na maneira como as coisas foram implementadas ou até mesmo por consumo de serviços que bloqueiam por tempo demais uma transação. Existem outros cenários que poderiam melhorar a performance de uma aplicação sem antes considerar uma migração de tecnologia, como por exemplo, parametrização da *JVM*.

Resumidamente, se hoje uma aplicação funcionar bem utilizando *Spring MVC*, não "existem" motivos reais para que seja realizado uma migração para *WebFlux*, além do fato que, dependendo do problema, pode existir outra formas de resolve-lo, sem antes considerar uma migração de tecnologia.

Porém, se a aplicação estiver com problemas relacionado a quantidade de *threads*, ou fizer uso de *streaming* de dados ou mesmo ter como prioridade um uso eficiente de recursos de *hardware*, talvez a utilização de *WebFlux* seja uma saída.

Enfim, não existe uma formula mágica que irá dizer se devemos ou não utilizar *WebFlux* ou *MVC* em nossos projetos. Sempre será necessário analisarmos o cenário que temos e comparar com as opções que temos disponíveis, mas é sempre importante entendermos as vantagens e desvantagens destas e outras tecnologias.

Pode ser que que uma migração não seja necessária agora, mas no futuro ela pode vir a ser e é sempre bom estarmos preparados.
