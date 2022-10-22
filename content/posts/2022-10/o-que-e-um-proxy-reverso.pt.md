---
title: "O que é um Proxy Reverso?"
date: 2022-10-22T12:00:00-03:00
tags:
    - architecture
    - network
images: 
  - src: "/images/posts/gate-g2919ae08c_640.jpg"
    alt: "O que é um Proxy Reverso?"
url: "/pt/posts/2022-10/o-que-e-um-proxy-reverso/"
---

Um proxy reverso é um servidor que possuí como funcionalidade principal receber requisições de uma rede externa, normalmente Internet, e as encaminhar para servidores de uma rede interna.

Esse servidor atua como ponto de entrada do usuário para sua aplicação, o que permite realizar diversos tipos de customizações na requisição recebida, como alteração de parâmetros da requisição ou reescrita do caminho (*path*) em uma requisição *REST*.

Balanceamento de carga também é uma das capacidades destes servidores, onde não apenas podem distribuir as requisições entre as diversas instâncias de uma aplicação, como também enviar para outras conforme parâmetros recebido na requisição.

Por exemplo, quando uma requisição é feita para o *endpoint* `/search`, essa requisição pode ser encaminhada para as instâncias de um serviço de busca, já quando for `/users`, as requisições vão para o serviço de usuários. 

Isso permite não apenas centralizar o endereço de acesso aos serviços disponíveis, onde todos utilizam o mesmo domínio (*host*), como também permite realizar o balanceamento de carga entre as diversas instâncias de cada serviço.

Diversas outras funcionalidades podem ser aplicadas nesses servidores, algumas soluções possuem mais, outras menos customizações/funcionalidades. Como exemplo de aplicações para esse propósito, podemos citar:

- [NGINX](https://www.nginx.com/)
- [HAProxy](http://www.haproxy.org/)

## Conclusão

Como pode ser notado, um proxy reverso pode melhorar não só a disponibilidade e escalabilidade de uma aplicação, pois através dele é possível realizar o balanceamento de carga entre as aplicações. Não somente isso, mas com seu uso, também é possível centralizar em apenas um endereço (*URL*) todos os serviços disponíveis, criando o que podemos chamar de *API Gateway*.

Outros tipos de recursos podem ser adicionados nessa camada, como, por exemplo, cache, autenticação/autorização, verificações de certificados (TLS, mTLS), além de melhorar a segurança dos serviços, uma vez que este não está disponível diretamente.

## Links

- [What Is a Reverse Proxy Server?](https://www.nginx.com/resources/glossary/reverse-proxy-server/)
- [What is a reverse proxy? | Proxy servers explained](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/)
- [Reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy)
- [What is Reverse Proxy Server/](https://www.imperva.com/learn/performance/reverse-proxy/)
- [What is the difference between Proxy and Reverse Proxy? | How To Use Reverse Proxy for Access Management Control](https://www.strongdm.com/blog/difference-between-proxy-and-reverse-proxy)