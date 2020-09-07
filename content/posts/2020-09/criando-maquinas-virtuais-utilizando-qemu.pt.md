---
title: "Criando maquinas virtuais (VM's) utilizando QEMU"
date: 2020-09-06T21:00:00-03:00
tags:
    - virtualization
images: 
  - src: "/images/posts/qemu.jpg"
    alt: "QEMU"
    stretch: "vertical"
url: "/pt/posts/2020-09/criando-maquinas-virtuais-utilizando-qemu/"
---

Recentemente precisei realizar alguns testes simples de uma aplicação que somente funcionavam  no Windows e como não possuo esse ambiente, decidi criar uma VM com Windows 10. Minha primeira ideia foi utilizar o [VirtualBox](https://www.virtualbox.org/), porém por algum motivo, não conseguia de forma alguma inicializar o instalador, sempre gerando um erro aleatório ou então a tela ficava estilo o chiado de uma TV, porém colorido e sem som.

Esse problema, impedia que eu prosseguisse com a instalação e quase me fez desistir do teste que iria realizar, porém, resolvi testar criar uma VM utilizando o [QEMU](https://www.qemu.org/).

Apesar de existirem interfaces (GUI) para realizar configurações de VM's para o QEMU, não encontrei no Homebrew nenhuma das alternativas que conheço ([aqemu](https://github.com/tobimensch/aqemu), [virt-manager](https://virt-manager.org/)) e para realizar meu teste, decidi fazer o procedimento de forma manual.

## O que é QEMU

Pode se dizer que o QEMU é um aplicativo de código aberto, multiplataforma, que serve para emular máquinas (VM) e virtualizar instruções de outras plataformas, como, por exemplo, emular instruções ARM e PowerPC em ambientes x86.

## Instalando o QEMU

A instalação pode ser feita de diversas formas, e todas elas podem ser encontradas [aqui](https://www.qemu.org/download/). Neste texto, irei descrever como é feito a instalação no macOS utilizando-se do Homebrew e sistemas Linux que são baseados em Debian/Ubuntu.

```bash
# macOS
brew install qemu

# Debian/Ubuntu
apt-get install qemu
```

## Criando um disco para instalação do sistema operacional

Utilizamos para tal o comando `qemu-img` como, por exemplo:

```bash
qemu-img create -f qcow2 windows10.qcow2 30G
```

No comando acima, estamos criando um arquivo, chamado `windows10.qcow2` com 30G. Esse arquivos será utilizado para instalarmos o Windows 10.

## Instalando o sistema operacional no disco criado

Neste ponto, devemos nos atentar ao sistema que será virtualizado, sendo necessário executar o comando de acordo. Por exemplo, se a instalação for do Windows 10 64 bits, o comando deverá ser o `qemu-system-x86_64`, para o caso do ambiente ser baseado em ARM, o comando seria: `qemu-system-arm`.

Para meu cenário, instalarei o Windows 10 64 bits, logo o comando que irei executar será o seguinte:

```bash
qemu-system-x86_64 -hda windows10.qcow2 -m 4G -cdrom ~/Downloads/tibia/Win10_2004_EnglishInternational_x64.iso -boot c
```

No comando acima, o QEMU irá simular um ambiente 64 bits, com 4G de memória RAM, utilizando o arquivo criado anteriormente como disco e o arquivo ISO, [baixado do site da Microsoft](https://www.microsoft.com/pt-br/software-download/windows10ISO), que contem a imagem de instalação, será apresentado ao sistema como se fosse um CD.

## Iniciando o sistema instalado

Após todo o procedimento, caso você não encerre o QEMU, você irá acessar normalmente sua máquina virtual, porém, após encerrado, caso deseje acessar outra vez, basta executar o seguinte comando:

```bash
qemu-system-x86_64 -m 4G -hda windows10.qcow2
```

## Conclusão

Como visto, relacionado a virtualização, existe uma alternativa gratuita ao VirtualBox que pode muitas vezes suprir nossas necessidades de criação e execução de máquinas virtuais. Apesar de uma complexidade maior, conhecer o QEMU pode ser útil para situações na qual não temos uma solução mais amigável para criarmos nossas VMs.

Para saber mais sobre o QEMU, recomendo olhar o Wiki oficial: [https://wiki.qemu.org/Main_Page](https://wiki.qemu.org/Main_Page)
