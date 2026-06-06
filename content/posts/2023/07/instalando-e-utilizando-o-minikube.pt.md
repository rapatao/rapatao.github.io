---
title: "Instalando e utilizando o minikube"
date: 2023-07-09T09:00:00Z
tags:
  - kubernetes
url: "/pt/posts/2023-07/instalando-e-utilizando-o-minikube/"
---

No meu atual projeto, usamos massivamente *Kubernetes* e com isso, precisei por mais de uma vez realizar testes para verificar se meu arquivo de *deployment* estava correto. Apesar de existirem ambientes dos quais eu poderia utilizar para testar, resolvi utilizar o *minikube*, para assim, realizar testes localmente e não arriscar impactar outros usuários/aplicações.

## Instalação

O pacote *minikube* está disponível para as plataformas *macOS*, *Linux* e *Windows*, porém, demonstrarei apenas como instalar no *macOS* utilizando o *Homebrew*. Caso deseja instalar em outras plataformas ou com um método diferente, basta verificar as opções [aqui](https://minikube.sigs.k8s.io/docs/start/).

### Instalação no macOS com Homebrew

O pacote do *minikube* está disponível no *Homebrew* e pode ser instalado utilizando o seguinte comando:

```bash
brew install minikube
```

Desta forma, não somente o *minikube* será instalado, como também o pacote *kubernetes-cli*, necessário para acessar os recursos do *Kubernetes* através do terminal.

## Inicialização do cluster

Para inicializar um *cluster* *Kubernetes* utilizando o *minikube*, basta abrir um terminal e executar o seguinte comando:

```bash
minikube start
```

Com este comando, um *cluster* será inicializado e também as configurações locais para acessar através do comando *kubectl* serão definidas.

A criação deste *cluster*, preferencialmente, será em um contêiner *Docker*, porém, caso este não esteja disponível, outros métodos podem ser utilizados. O comando *minikube* se encarrega de identificar os métodos (drivers) disponíveis e os utilizar.

É possível especificar qual driver utilizar, para isso, basta adicionar um argumento especificando qual driver deseja utilizar, como no exemplo a seguir, no qual é especificado a utilização do *Hyperkit*.

```bash
# minikube start --driver=<driver name>
# ex.:
minikube start --driver=hyperkit
```

Existe também a opção de definir um driver como padrão, para que, sempre que o *cluster* seja criado, este seja o método utilizado. Para isso, basta executar o comando a seguir, alterando para o driver desejado.

```bash
# minikube config set driver <driver name>
# e.:
minikube config set driver hyperkit
```

Para maiores detalhes dos drivers suportados, recomendo verificar a [documentação oficial](https://minikube.sigs.k8s.io/docs/drivers/), a qual também detalha as diferenças, customizações e limitações para cada driver.

## Acesso ao dashboard (interface web)

O *cluster* criado com o *minikube* provê um *dashboard* que pode ser acessado através do seguinte comando:

```bash
minikube dashboard
```

A execução deste comando, deve abrir automaticamente seu navegador padrão, porém, caso aconteça, na saída do terminal é possível identificar qual URL que deve ser utilizada para acessar o *dashboard*.

<aside>
💡 Este *dashboard* permite visualizar, criar, modificar e remover os recursos disponíveis no *cluster* por meio de uma interface web, assim como é possível quando utilizamos o cliente via terminal (*`kubectl`*)

</aside>

## Acesso a um service ou ingress

Quando criado um *service* do tipo *LoadBalancer* ou mesmo criado um *Ingress*, para acessa-lo é necessário executar o seguinte comando em terminal:

```bash
minikube tunnel
```

Para o caso específico do *Ingress*, é necessário ainda instalar um *addon* no Kubernetes. Para isso, basta executar o seguinte comando:

```bash
minikube addons enable ingress
```

## Parar ou Remover o cluster

O processo de parar o *cluster*, pode ser realizado utilizando o seguinte comando em um terminal:

```bash
minikube stop
```

Este comando, apenas pausa o *cluster* e, consequentemente, liberar os recursos utilizados (CPU/Memória) para o host. Quando executado novamente o comando `minikube start`, este mesmo *cluster* é recuperado, com todas as modificações realizadas até então.

Caso queira remover o *cluster*, o comando a ser executado será:

```bash
minikube delete
```

Este comando também irá remover todos os dados persistidos, ou seja, quando o comando `minikube start` for executado, um novo *cluster* será criado.

## Conclusão

Apesar de não detalhado neste texto, diversos outros recursos e customizações estão disponíveis no *minikube*, alguns em formato de *addons*, que podem ser vistos utilizando o seguinte comando:

```bash
minikube addons list
```

Em resumo, o *minikube* é útil para quem quer ou precisar realizar testes em um *cluster* *Kubernetes* localmente, pois, além de fácil instalação, também é possível instalar diversas extensões que podem facilitar, e muito, seu desenvolvimento e/ou testes de aplicações.
