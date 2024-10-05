---
title: "Pensando em GraalVM? Devo escolher Quarkus ou Micronaut?"
date: 2021-03-24T21:00:00-03:00
tags:
  - quarkus
  - micronaut
  - architecture
images:
  - "/images/posts/quarkus-micronaut.png"
url: "/pt/posts/2021-03/pensando-em-graalvm-devo-escolher-quarkus-ou-micronaut/"
aliases:
  - "/posts/2021-03/pensando-em-graalvm-devo-escolher-quarkus-ou-micronaut/"
---

Recentemente no trabalho, pretendíamos utilizar *GraalVM* em uma nova aplicação. Buscando soluções compatíveis, vimos que *Quarkus* e *Micronaut* pareciam promissores e decidimos analisa-los. 

> Nota: Quando essa analise foi realizada, *Spring* possuía um suporte muito limitado ao *GraalVM* e foi desconsiderado.

Dentre as opções citadas, diversos *benchmarks* disponíveis na Internet foram consultados, além de verificado a **compatibilidade** com ferramentas e bibliotecas normalmente utilizadas nos projetos da empresa. Outros fatores foram analisados, como facilidade e qualidade da **documentação** e **curva de aprendizado** nessas tecnologias. 

## Curva de aprendizado

![Curva de aprendizado](/images/posts/pexels-energepiccom-313690.jpg#center)

Apesar de muitas vezes ser desconsiderado em análises por parte das pessoas de tecnologia, a complexidade em aprender e, de fato, entender o funcionamento de uma tecnologia afeta muito a qualidade e produtividade da equipe em um projeto. Considerando ainda que pretendíamos utilizar *GraalVM*, era extremamente prudente levar esse tópico em consideração, visto que não seria apenas uma tecnologia "nova" a ser implementada no mesmo projeto.

Os membros da equipe também possuíam um bom conhecimento de *Spring*, sendo esse o que é normalmente utilizado nos projetos desenvolvidos, seja utilizando o tradicional *MVC* ou o reativo *WebFlux*.

Dentre os projetos que normalmente desenvolvemos, raramente temos uma complexidade elevada, no sentido de integração ao *framework*, sendo que normalmente apenas disponibilizamos uma *API Rest* que, pode consumir outras *APIs* e um ou mais bases de dados, ou seja, nossa complexidade tende a estar nas regras de negócio.

Tendo em mente os pontos citados, tanto *Quarkus*, como o *Micronaut* possuem diversas similaridades com o *Spring*, e facilitariam muitos dos nossos casos de usos, porém como tudo é declarado no *Micronaut* (*beans*, *configurations*, etc) pareceu ser bem mais semelhante com o *Spring*, o que poderia auxiliar no processo de assimilação da ferramenta.

Outro ponto que também trouxe certa facilidade com o *Micronaut*, foi o suporte que este possuí a declaração de *queries* de forma declarativa, semelhante à forma como ao disponível no *Spring Data* ou no *GORM* do *Grails.*

Durante essa análise, confirmamos que o *Quarkus* tende a seguir ou priorizar o uso de especificações, como *JAX-RS*, por exemplo, tendendo a não ser o normal de quem está no universo do *Spring*.

## Compatibilidade

![Compatibilidade](/images/posts/pexels-castorly-stock-3639031.jpg#center)

Como dito anteriormente, nossos casos de usos raramente possuem grande complexidade, sendo limitado a análise nos cenários mais comuns, ou seja, disponibilização e consumo de uma *APIs REST*, além de acesso a bases de dados, normalmente *MySQL*.

A disponibilização de *endpoints*, ambas ferramentas possuem similaridades, com foco no fato do *Quarkus* utilizar por padrão anotações *JAX-RS*, enquanto o *Micronaut*, apesar de possuir suporte a elas, utilizar anotações próprias, porém estas são bem intuitivas. Um ponto importante, e muito negligenciado quando falamos de *APIs*, seria sua documentação e neste assunto, ambos possuem suporte nativo para *OpenAPI*, permitindo que seja gerado uma documentação com base na declaração de *endpoints* existentes no código (*code first*).

Assim como é simples para disponibilizar um *endpoint*, criar um cliente HTTP também é semelhante em ambos *frameworks*, em que *o* cliente é construído apenas com a criação de uma interface anotada, explicitando em seus métodos, o verbo, o caminho, seus parâmetros, seus cabeçalhos e o corpo da requisição, muito semelhante aos já conhecidos *[Feign](https://github.com/OpenFeign/feign)* e *[Retrofit](https://square.github.io/retrofit/)*.

Um ponto que pode ser considerado interessante no *Micronaut* é em relação às configurações de (des)serialização, onde estas podem ser definidas no arquivo de configuração, sem necessidade de codificação. Através desse arquivo é possível definir desde qual estratégia de nomes utilizar (*camel case, snake case, etc)*, até como os dados devem ser convertidos enquanto no *Quarkus*, isso somente pode ser realizado por codificação, elevando a quantidade de código produzido/contido no projeto.

O acesso a bases de dados é similar, com ambos possuindo suporte ao *Hibernate* e a suporte nativo a diversas bases. A questão está na forma como serão declaradas as consultas que serão realizadas, com o *Micronaut* suportando declarações por interfaces e métodos descritivos, enquanto o *Quarkus*, até onde consegui identificar, realiza de uma maneira mais declarativa e, consequentemente, verbosa.

Nesse projeto em questão, precisávamos realizar uma espécie de versionamento de todas as entidades que fossem alteradas na base de dados, porém, o histórico é armazenado em um serviço externo a aplicação. A maneira mais simples de se realizar essa integração seria através de um *interceptor* no *Hibernate.* Com o *Micronaut*, essa integração é extremamente simples, bastando disponibilizar no contexto um *bean* deste tipo, que este é automaticamente utilizado. Em relação ao *Quarkus*, eu não consegui identificar como seria realizado essa integração e tampouco consegui encontrar, seja na internet, seja em sua documentação oficial.

## Documentação

![Compatibilidade](/images/posts/pexels-anastasia-zhenina-93519.jpg#center)

Considero este um dos tópicos mais importantes a ser analisado, pois, a documentação é e deve ser sempre utilizada como referência para analisar ou construir eventuais casos de usos, ou apenas para entendimento das funcionalidades disponibilizadas por uma ferramenta.

Neste ponto, acredito que o *Quarkus* deixa muito a desejar, pois, sua documentação é baseada em guias práticos e, particularmente, considero isso muito ruim para um projeto de longa duração, mas são excelentes para quem gostaria de realizar testes de alguma integração ou funcionalidade. Ou seja, no decorrer do desenvolvimento de um projeto, a tendência é que as pesquisas relacionadas a tecnologia deixem de ser o "como fazer algo" para os "porquês de algo acontecer". Com a separação por guias, essa pesquisa se torna difícil e cansativa, o que faria com que as pessoas buscassem outros meios, como *Stack Overflow*, por exemplo. Como exemplo, posso mencionar a necessidade citada acima, de criar um *Interceptor*, e eu não consegui encontrar nos guias exemplos de utilização e mesmo em mecanismos de pesquisa, não consegui encontrar nada relacionado a isso.

Por outro lado, com o *Micronaut*, sua documentação é bem mais detalhada e completa, acredito que falte muito para chegar no nível de conteúdo que a documentação do *Spring* possui, mas nela é possível encontrar praticamente tudo relacionado a um tópico de forma centralizada ou  em documentações específicas de uma extensão, reduzindo em muito a necessidade de abrir e ler diversos guias de um mesmo assunto para encontrar algo específico.

## Conclusão

Ambos *frameworks* possuem suporte e compatibilidade com os cenários que analisamos e poderiam ser adotados de forma tranquila em qualquer um de nossos projetos. Porém, a curva de aprendizado do *Micronaut* demonstrou ser bem mais tranquila, com bastante similaridades com o já utilizado *Spring* como, por exemplo, suporte ao acesso a bases de dados através da declaração de interfaces e métodos descritivos.

Porém, o fator que acredito que teve um maior peso na decisão foi a documentação, que apesar de acreditar que ainda possa ser evoluída, no *Micronaut* é muito mais completo e de fácil localização do que a encontrada com os guias disponibilizados pelo *Quarkus.*

Com tudo dito, se fosse para sair do universo *Spring*, seja para adoção ou não do *GraalVM*, hoje escolheria *Micronaut*, sem grandes receios nessa decisão.

Agradeço a leitura e sinta-se a vontade de realizar qualquer questionamento sobre o assunto.