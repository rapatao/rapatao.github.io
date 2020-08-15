---
title: "Seus dotfiles sob controle"
date: 2020-08-15T15:00:00-03:00
tags:
    - dotfiles
    - yadm
---

Muitos desenvolvedores ao longo de sua carreira acaba criando diversos *scripts*, *aliases* e customizações em seus ambientes de desenvolvimento. Essas configurações, normalmente ficam em arquivos e, quando este usuário muda seu ambiente, por vezes, faz uma cópia desses arquivos para o novo ambiente. Esse processo tende a ser feito copiando seus arquivos de um ambiente para outro.

Apesar de funcionar, existe maneira mais prática para gerenciar esses arquivos, realizando as devidas associações conforme necessários, inclusive suportando perfis diferentes. Ou seja, é possível criar um *dotfile* com diversos perfis, definindo configurações diferentes de acordo com sua necessidade. Um exemplo desta utilização, seria construir um perfil para seu ambiente pessoal, outro para seu ambiente profissional, alterando chaves de acesso a servidores e configurações de assinatura de *commits* no *git*.

## O que são dotfiles

Em sistemas baseados em Unix, é comum as configurações serem mantidas em arquivos iniciados com ponto (.). Estes arquivos ou pastas, são considerados como “ocultos” e normalmente não são listados utilizando-se comandos como *ls*, exceto quando especificado para que sejam exibidos.

Exemplos de arquivos e pastas inciados com ponto (.):

```bash
.gitignore
.m2
.bashrc
.zshrc
```

Isso não quer dizer que seus arquivos precisam iniciar com ponto (.) e de fato existem diversas pessoas que não o definem assim, separando em pastas com nomes condizentes, como, por exemplo “*$HOME/etc”*. Particularmente, prefiro manter tais arquivos dentro de uma pasta iniciando com o ponto (.), especificamente “*$HOME/.dotifiles.d*”, pois esta pasta não é listada por padrão, logo não será notada na maioria das vezes, o que gera em mim uma sensação de organização.

{{< amazon_ad search_phrase="linux shell" >}}

## Um gerenciador para dotfiles

Como dito anteriormente, existem diversas maneiras para gerenciar seus *dotfiles*, seja ele de forma manual ou automatizada com auxílio de aplicativos. Utilizar um controlador de versões, como o *git* é uma forma interessante fazer, porém, ainda precisaremos realizar os vínculos de forma manual em cada ambiente instalado.

Apesar de ser possível versionar seu *$HOME*, ao fazer isso, por padrão, sua lista de arquivos ignorados ficaria extremamente extensa, além do risco de adicionarmos arquivos indevidos em nosso repositório. Utilizando-se da versalidade que o *git* nos oferece, mas sem a dificuldade de termos que adicionar diversos arquivos e diretórios em nosso *gitignore*, o *[yadm (Yet Another Dotfiles Manager)](https://yadm.io/)* nos auxilia na tarefa de gerenciar nossas configurações, com diversos recursos interessantes adicionais.

Como uma espécie de “casca” do *Git*, com o *yadm* você poderá versionar de forma simplificada seu *$HOME*, com a capacidade de adicionar criptografia em arquivos sensíveis, como chave de acesso, utilizar arquivos alternativos conforme o ambiente ao qual seus *dotfiles* estão sendo utilizados, além de claro, saber exatamente o que foi alterado antes de atualizar seu repositório de configurações.

## Instalando o yadm

Existem diversas formas de realizar a instalação do *yadm*, seja ela utilizando gerenciadores de pacotes como o *Homebrew e apt-get* até baixar o arquivo em uma pasta em seu dispositivo. Todas essas formas, podem ser encontradas na documentação oficial [aqui](https://yadm.io/docs/install).

Cada sistema operacional oferece uma forma de instalar, que acaba por facilitar o processo de atualização do *yadm* e abaixo segue forma de instalação com maior compatibilidade, ou seja, independente de seu sistema operacional ser macOS, Ubuntu, Arch Linux ou FreeBSD.

```bash
$ curl -fLo /usr/local/bin/yadm https://github.com/TheLocehiliosan/yadm/raw/master/yadm && chmod a+x /usr/local/bin/yadm
```

O *yadm* tem como requisito que o *Git* esteja instalado em seu sistema e ao tentar executar sem essa dependência, a seguinte mensagem de erro será apresentada:

```bash
$ yadm version
/usr/local/bin/yadm: line 909: git: command not found
ERROR: This functionality requires Git to be installed, but the command 'git' cannot be located
```

Com o *Git* instalado a mensagem deve ser a seguinte:

```bash
$ yadm version
yadm 2.5.0
```

## Adicionando seus primeiros arquivos

Os comandos utilizados para inciar um repositório, adicionar arquivos, realizar *commit* bem como enviar e baixar atualizações de um repositório, são os mesmos disponíveis no *Git*, apenas iniciados com *yadm*.

Para iniciar seu primeiro repositório, o seguinte comando deve ser executado:

```bash
$ yadm init
Initialized empty shared Git repository in /home/rapatao/.config/yadm/repo.git/
```

Após inicializado, você pode adicionar todos os arquivos que considera importantes e devem ser versionados, isso normalmente inclui arquivos como, por exemplo: *.bashrch e .zshrc*

Para adicionar arquivos, basta executar o comando abaixo, onde *<file>* deve ser substituído pelo arquivo que deseja versionar.

```bash
$ yadm add <file>
```

Adicionado os arquivos, é hora de realizar seu primeiro *commit* e para isso, basta executar o comando a seguir:

```bash
$ yadm commit -m "primeiro commit"
[master (root-commit) 506b780] primeiro commit
 1 file changed, 117 insertions(+)
 create mode 100644 .bashrc
```

Caso seu *Git* não esteja corretamente configurado, a mensagem abaixo será apresentada, informando que seu e-mail e nome não foram configurados, impedindo que seu *commit* seja realizado. Para solucionar, basta executar o comando conforme orientado na mensagem e repetir o procedimento, conseguindo assim realizar seu *commit*.

```bash
$ yadm commit -m "primeiro commit"

*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

to set your account's default identity.
Omit --global to set the identity only in this repository.

fatal: unable to auto-detect email address (got 'rapatao@89122a756847.(none)')
```

## Suas configurações em um repositório remoto

Uma das vantagens do *Git* é que você pode ter um repositório local e uma cópia deste repositório remotamente. Isso é extremamente útil para garantir que seus arquivos possam ser acessados praticamente de qualquer lugar.

Para enviar seus arquivos para um repositório remoto, você pode utilizar serviços disponíveis na Internet, como GitHub, BitBucket ou GitLab. O procedimento é similar ao realizado com o comando *Git*, sendo necessário apenas que um repositório remoto exista. Exemplo:

```bash
$ yadm remote add origin <url>
$ yadm push -u origin master
```

{{< amazon_ad search_phrase="git" >}}

## Suas configurações em um novo ambiente

Com o advento do repositório descentralizado, para instalar seus arquivos em um novo ambiente, basta executar o seguinte comando:

```bash
$ yadm clone <url>
```

O comando irá realizar o clone do repositório localmente e os arquivos versionados, serão copiados para os devidos locais, ou seja, tudo que você configurou será automaticamente replicado para esse novo ambiente e tudo que você precisou fazer, foi instalar o *yadm*.

É importante ressaltar, que ao realizar o *clone*, o *yadm*, irá tentar realizar um *merge* com os arquivos pré-existentes no novo ambiente, podendo causar conflitos ou mesmo falhando no processo. Normalmente esses arquivos serão, de fato, substituídos pelo conteúdo que você versionou anteriormente, logo a maneira mais simples para resolver tal problema é excluindo tais arquivos existentes localmente antes de realizar o clone.

## Sistemas diferentes com arquivos diferentes

Uma das grandes vantagens do *yadm* é a possibilidade de ter arquivos com diferentes configurações e estes serem utilizados conforme regra pre-definida. Por exemplo, é possível criar arquivos de configuração do *Git* e conforme ambiente, um destes arquivos será utilizado.

Vamos supor que você utilize em sua casa um *macOS* e em sua empresa um *Linux*. Quando estiver em sua casa, você gostaria de ter seus *commits* assinados com o e-mail “*luiz@example.com*” e quando estiver na empresa com “*luiz.empresa@example.com*”.

Para isso, basta criar os arquivos com as devidas diferenças e salva-los utilizando o seguinte padrão:

```bash
<arquivo>##<condição>[,<condição>,...]
```

A lista completa de condições pode ser encontrada [aqui](https://yadm.io/docs/alternates).

No cenário reportado acima, teremos os seguintes arquivos:

```bash
$ ls -a .gitconfig*
.gitconfig##os.Darwin  .gitconfig##os.Linux
```

Agora basta gerenciarmos esses arquivos com o *yadm* e pronto, um link simbólico será criado apontado para o arquivo ao qual a condição for verdadeira.

```bash
$ yadm add .gitconfig*
$ ls -la .gitconfig*
lrwxrwxrwx 1 rapatao rapatao 20 Aug 15 17:25 .gitconfig -> .gitconfig##os.Linux
-rw-rw-r-- 1 rapatao rapatao 57 Aug 15 17:18 .gitconfig##os.Darwin
-rw-rw-r-- 1 rapatao rapatao 57 Aug 15 17:18 .gitconfig##os.Linux
```

Como podemos notar, ao adicionarmos o arquivo o *yadm* criou automaticamente um link simbólico apontando de "*.gitconfig"* para "*.gitconfig##os.Linux".*

## Conclusão

Como podemos ver até aqui, a utilização do *yadm* pode auxiliar a controlar nossas configurações, unindo todo o potencial que o *Git* nos oferece, como controle de mudanças e distribuição de conteúdo, bem como diversos outros recursos, como o exemplo acima, onde “customizamos” nossas configurações com base no sistema operacional que estamos executando.

Além dos recursos citados acima, existem outros e apesar de não os descrever neste texto, acredito que possa ser interessante para quase todos os usuários:

- [Encryption](https://yadm.io/docs/encryption): Criptografa conteúdo sensível. Útil para versionar chaves SSH, uma vez que para decodificar, será necessário o fornecimento de uma senha definida pelo usuário.
- [Bootstrap](https://yadm.io/docs/bootstrap): Um *script* que pode ser executado ao clonar um repositório. Útil para instalar aplicativos normalmente utilizados e/ou necessários para correto funcionamento de seu ambiente.

Acredito ter falado sobre os principais tópicos sobre dotfiles e como gerencia-los utilizando o *yadm*. Para maiores detalhes, recomendo olhar o site oficial [yadm.io](https://yadm.io/), mas fique a vontade em me perguntar diretamente algo sobre o assunto.

{{< amazon_ad search_phrase="linux" >}}