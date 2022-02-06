---
title: "Load Balancing: O que é um balanceador de carga?"
date: 2022-02-05T20:00:00-03:00
tags:
    - architecture
    - network
images: 
  - src: "/img/posts/pexels-brett-sayles-7146867.jpg"
    alt: "Load Balancing: O que é um balanceador de carga?"
url: "/pt/posts/2022-01/load-balancing-o-que-e-um-balanceador-de-carga/"
---

Muito utilizado em aplicações com alto volume de acesso simultâneo, um balanceador de carga (*load balancer*) é um recurso computacional utilizado para realizar a distribuição de carga entre dois ou mais servidores de uma aplicação.

Normalmente são implementados com uso de máquinas dedicadas para esse trabalho, podendo elas serem físicas ou virtuais, ou por “*softwares*”. 

## Benefícios

Independente do modelo a ser implementado, eles visam distribuir o processamento de uma aplicação entre as instâncias disponíveis, onde se busca otimizar o uso de recursos computacionais, como rede, processamento (*CPU*), uso de memória, entre outros.

Essa distribuição de recursos, reduz o risco com que as instâncias de uma aplicação fiquem sobrecarregadas, consequentemente otimizando tempos de resposta em momentos de elevado número de acessos simultâneos a aplicação.

Outro benefício que advém da utilização de balanceamento da carga é, o incremento na disponibilidade (resiliência), pois estes usam validação de sanidade das aplicações, o que faz com que casos onde uma ou mais instâncias estejam indisponíveis, nenhum trafego seja encaminhado para elas, auxiliando assim para que o usuário final não perceba essa indisponibilidade.

## Modelos de balanceamento

Um balanceador de carga pode operar em duas camadas de rede do modelo [*OSI*](https://pt.wikipedia.org/wiki/Modelo_OSI), na camada 4 (transporte) e na camada 7 (aplicação). Balanceadores construídos na camada de transporte tendem a requerer menor poder de processamento para realização da tarefa, contudo, possuem acesso a menos informações da requisição que implantações da camada de aplicação. Apesar mais custosos, em relação à necessidade de processamento, implantações na camada 7 tendem a trazer muitos benefícios e com custos cada vez mais acessíveis, sua adoção tem crescido muito nos últimos anos.

<aside>
💡 É importante se atentar que existem casos em que um balanceador em camada de aplicação não se justificaria (custo x benefício), pois, as requisições a serem processadas nunca requerem controle que não seja obtido com implantações em camada de transporte.
</aside>

### Camada 4: Transporte

Esse modelo de balanceamento trabalha na camada de transporte, ou seja, as decisões de roteamento são baseadas em dados disponíveis nela, ou seja, informações de protocolos, como *TCP* ou *UDP*, endereçamento *IP* destino e origem. Com base nessa informação é realizado o encaminhamento do pacote através de um recurso chamado [*NAT*](https://pt.wikipedia.org/wiki/Network_address_translation).

É importante se atentar que balanceamento nessa camada é feito puramente com essas informações, ou seja, o conteúdo do pacote não é interceptado e/ou analisado durante o encaminhamento, o que pode dificultar ou mesmo incapacitar a criação de regras que garantem que um mesmo usuário tenha suas requisições sempre direcionadas para uma mesma instância de uma aplicação, o que pode ser problemático quando, por exemplo, há necessidade de controle de sessão do usuário.

### Camada 7: Aplicação

Este modelo de balanceamento oferece maior quantidade de recursos para decisões de balanceamento e isso se deve ao fato de atuar na mais alta camada do modelo OSI. Por estar nessa camada, é possível analisar além das informações existentes na camada 4, como também outros relacionados a requisição recebida para decidir para qual instância será encaminhada a requisição. Por exemplo, em um balanceamento de requisições HTTP, podemos verificar informações contidas no header para decidir o servidor destino, isso não permite controlarmos a distribuição no uso dos recursos, como também permite garantir outros controles, como, por exemplo, garantir que todas as requisições de um determinado usuário sejam sempre processadas por mesma instância da aplicação.

## Estratégias de balanceamento

O princípio de uma balanceador de carga é distribuir as requisições entre os servidores disponíveis para processamento da requisição, porém, em praticamente todas as implementações, temos como definir como essas requisições serão distribuídas entre as instâncias de nossa aplicação. Essa decisão é feita por algoritmos pré definidos, mas normalmente também é possível criar regras customizadas.

Neste texto descreverei dois dos algoritmos que acredito serem os mais utilizados, porém, diversos outros existem e é sempre recomendável avalia-los antes de eleger qual utilizar em sua aplicação.

### Round Robin

Esse algoritmo é normalmente o padrão utilizado por muitas soluções de balanceamento existentes no mercado. Nele, cada requisição é encaminhada para uma instância diferente dentre as disponíveis, seguindo uma ordem padronizada e continua.

<aside>
💡 Exemplo: Considerando 3 servidores destinos, a primeira requisição será encaminhada para o primeiro servidor, a segunda para o segundo servidor e a terceira para o terceiro servidor. A partir da quarta requisição, a lista de servidores é reiniciada, ou seja, ela seria encaminhada para o primeiro servidor, a próxima para o segundo e assim sucessivamente.
</aside>

Apesar de efetivo para a maioria dos casos, esse algoritmo pode causar sobrecarga em um dos servidores, pois ele não considera as requisições pendentes para encaminhar ou não uma requisição. Ou seja, ele pode ser problemático para casos onde a maioria das requisições processadas pela aplicação tiverem tempos muito diferentes entre elas e requererem uso intensivo de processamento para conclusão, o que faz com que um dos servidores possa ter mais requisições sendo processadas em determinado momento que outros, consequentemente, degradando o desempenho da aplicação.

### Least Connection

Esse algoritmo faz o encaminhamento aos servidores utilizando um modelo simples de análise, que consiste em verificar qual servidor dentre os disponíveis têm menor quantidade de requisições no momento.

<aside>
💡 Exemplo: Considerando 3 servidores destinos, onde atualmente temos o primeiro com 5 conexões, o segundo com 3 e o terceiro com 4, nesse modelo, a próxima requisição seria encaminhada para o segundo servidor, por ser o que possuí menor conexões ativas no momento e essa lógica seria aplicada para todas as novas requisições.
</aside>

Ou seja, é um modelo muito eficaz em relação à distribuição de carga e normalmente superior em desempenho, pois o servidor com menor quantidade de requisições será sempre o eleito a receber uma próxima requisição. Contudo, ele ainda pode ser impactado com distribuição de requisições, onde um servidor apesar de possuir menor quantidade de conexões, todas requerem elevado poder de processamento, degradando assim todas as requisições ativas neste servidor.

## Soluções existentes

No mercado existem diversos dispositivos e aplicações com intuito de oferecer uma solução de balanceamento de cargas. Provedores de *cloud*, como *[Amazon AWS](https://aws.amazon.com/elasticloadbalancing/)* e *[Google Cloud](https://cloud.google.com/load-balancing)*, também possuem soluções nativas disponíveis, o que pode facilitar sua implementação quando em uso destes provedores.

No mundo *Open Source*, existem diversas soluções criadas para esse fim, cada uma com suas vantagens e desvantagens. 

Segue uma lista com as que acredito serem as principais soluções atualmente e suas respectivas camadas de atuação:

- [HAProxy](https://github.com/haproxy/haproxy) (camada 4 e 7)
- [nginx](https://github.com/nginx/nginx) (camada 7)
- [Seesaw](https://github.com/google/seesaw) (camada 4)
- [Traefik](https://github.com/traefik/traefik) (camada 7)

## Conclusão

Resumidamente, um balanceador de carga (*load balancer*) é um recurso computacional, que pode ser um dispositivo ou uma aplicação, responsável por realizar a distribuição do processamento entre as diversas instâncias de uma aplicação através estratégias definidas.

Ele atua como um intermediador (*proxy*), recebendo e direcionando as requisições conforme regras definidas e visam, não só aumentar a capacidade de processamento de da aplicação como também sua disponibilidade.

Espero que este texto tenha ajudado a entender o que é um balanceador de carga e alguns dos problemas que essa solução visa resolver. Por fim, deixo alguns links que me foram uteis durante a elaboração deste texto.

## Referências

- [What Is Layer 4 Load Balancing?](https://www.nginx.com/resources/glossary/layer-4-load-balancing/)
- [What is a Load Balancer? Load Balancing Definition](https://www.citrix.com/en-in/solutions/app-delivery-and-security/load-balancing/what-is-load-balancing.html)
- [Load balancing (computing)](https://en.wikipedia.org/wiki/Load_balancing_(computing))