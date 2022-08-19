---
title: "O que é uma CDN (Content Delivery Network)?"
date: 2022-04-21T19:00:00-03:00
tags:
    - architecture
    - network
images: 
  - src: "/images/posts/pexels-pixabay-163064.jpeg"
    alt: "O que é uma CDN (Content Delivery Network)?"
url: "/pt/posts/2022-04/o-que-e-uma-cdn-content-delivery-network/"
aliases:
  - "/posts/2022-04/o-que-e-uma-cdn-content-delivery-network/"
---

Uma rede de distribuição de conteúdo, do inglês *Content Delivery Network*, pode ser descrita como um conjunto de servidores, distribuídos globalmente, com finalidade de prover conteúdo aos usuários de maneira otimizada e no menor tempo possível.

Como os servidores da CDN estão distribuídos em várias localizações, alguns destes servidores tendem a estarem localizados mais próximo ao usuário destino que o servidor origem, o que faz com que a distância que os dados percorrerem (fisicamente), seja menor, consequentemente, entregues mais rápido.

## O que pode ser distribuído e armazenado

O principal objetivo é armazenar conteúdos estáticos, ou seja, todo conteúdo que uma vez gerado, não sofre mais alteração. Exemplos desse conteúdo, quando falamos de um site, por exemplo, são os arquivos HTML, CSS, imagens e JavaScript.

Apesar de exemplificado alguns arquivos acima, outros formatos podem ser distribuídos sem grandes limitações, como vídeos, PDF, TXT, etc.

<aside>
💡 É importante dizer que alguns provedores, como a [AWS](https://aws.amazon.com/caching/cdn/), oferecem soluções que permitem disponibilizar conteúdos dinamicamente gerados em sua CDN, porém, estes, normalmente não ficam armazenados em seus servidores, apenas trafegados através da rede "interna", funcionando como um intermediador (*proxy*) entre origem (servidor) e destino (usuário).

</aside>

## Distribuição e replicação do conteúdo

Devido à natureza distribuída de uma CDN, o conteúdo a ser provido por ela precisa estar disponível para todas as instâncias dessa rede e, basicamente, existem duas maneiras de realizar a distribuição deste conteúdo. Elas são conhecidas como ***PULL*** e ***PUSH*** onde as principais diferenças entre elas está na maneira como os dados são disponibilizados na CDN.

### Modelo *PULL*

Neste modelo, sempre que um conteúdo for requisitado pelo usuário, a CDN verifica se já possuí o conteúdo em seus servidores, caso não, faz uma solicitação ao servidor origem, armazena os dados em sua rede (cache) para então retornar ao usuário os dados solicitados.

![Exemplo de CDN (modelo PULL)](/images/posts/20220421-cdn-pull.png#center)
  Exemplo de CDN (modelo PULL)

A principal vantagem deste modelo está em sua baixa complexidade de implementação, pois não é necessário disponibilizar o conteúdo a ser provido pela CDN antes da primeira solicitação do usuário, pois ela se encarregará de recuperar este conteúdo conforme necessário, ou seja, conforme for sendo requisitado pelos usuários. Em contrapartida, como o conteúdo não estará presente nos servidores da CDN durante as primeiras requisições, estas terão um tempo maior de resposta, dado a necessidade de recuperação destes conteúdos dos servidores de origem.

### Modelo *PUSH*

Diferente do modelo *PULL*, aqui o conteúdo a ser disponibilizado precisa obrigatoriamente estar disponível nos servidores da CDN antes de as requisições serem realizadas, ou seja, a CDN não será responsável por recuperar o conteúdo de uma origem, mas sim o desenvolvedor ou aplicação deve armazenar estes conteúdos de maneira manual ou por processos automatizados.

![Exemplo de CDN (modelo PUSH)](/images/posts/20220421-cdn-push.png#center)
  Exemplo de CDN (modelo PUSH)

Nesse modelo, temos uma complexidade maior em sua implementação, pois, o conteúdo precisa ser submetido aos servidores da CDN previamente, sejam por processos automatizados ou manuais. A automatização destes processos pode ser bastante complexa e ser necessário processos diferentes para cada aplicação existente, o que pode fazer com que, a automatização seja um processo extremamente complexo e custoso. Quando realizado de forma manual, falhas humanas podem ocorrer, como, por exemplo, esquecer de submeter algum conteúdo importante, causando uma falha inesperada na execução da aplicação.

Em contrapartida, um dos maiores benefícios obtidos nesse modelo é a consistência da resposta, dado que a CDN nunca necessita recuperar dados de outro lugar que não seus próprios servidores, o tempo de resposta tende a ser consistente e baixo.

Outra vantagem neste modo, é a capacidade de disponibilizar sistemas sem a necessidade de um servidor, utilizando somente a CDN. Por exemplo, é possível construir e disponibilizar um website que não dependa de serviços externos, apenas disponibilizando os arquivos HTML, CSS e JavaScript na CDN, sem nenhuma necessidade de servidores dedicados a eles.

## Conclusão

De maneira geral, apesar de agregar um certo nível de complexidade as aplicações, seu uso é normalmente válido e recomendável, pois, dado a proximidade dos servidores de um provedor de CDN com os usuários de sua aplicação, os dados solicitados por eles, são normalmente entregues com tempo baixo, independentemente de sua localização geográfica, sem a necessidade de adicionar servidores de sua aplicação ao redor do mundo, permitindo escalar sua aplicação/serviço sem necessariamente aumentar o custo operacional.

É importante dizer que o intuído do texto foi descrever o que é uma CDN e não detalhar serviços específicos de provedores específicos, como, por exemplo, a AWS, que permite disponibilizar conteúdos dinâmicos. Cada provedor tende a possuir características distintas, sejam disponibilizando funcionalidades novas, como disponibilidade geográfica e, é sempre recomendável identificá-las e validar a mais aderente as suas necessidades.

Fico por aqui, obrigado pela leitura, caso tenham dúvidas ou mesmo encontrem erros no texto, sinta-se a vontade de me contactar/avisar.

## Referências

- [What is a CDN? | How do CDNs work?](https://www.cloudflare.com/en-ca/learning/cdn/what-is-a-cdn/)
- [What is CDN? | How Does a Content Delivery Network Work?](https://www.belugacdn.com/blog/cdn/what-is-cdn/)
- [AWS: Content Delivery Network (CDN) Caching](https://aws.amazon.com/caching/cdn/)
- [Cloud CDN: Content Delivery Network | Google Cloud](https://cloud.google.com/cdn)