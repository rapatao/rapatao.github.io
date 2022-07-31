---
title: "GnuPG: como fazer backup e restaurar suas chaves?"
date: 2022-07-31T12:00:00-03:00
tags:
    - security
    - encryption
images: 
  - src: "/img/posts/pexels-lucas-seebacher-5599449.jpeg"
    alt: "GnuPG: como fazer backup e restaurar suas chaves?"
url: "/pt/posts/2022-07/gnupg-como-fazer-backup-e-restaurar-suas-chaves/"
aliases:
  - "/pt/posts/2022-07/gnupg-como-fazer-backup-e-restaurar-suas-chaves/"
---

Recentemente precisei transferir minhas chaves privadas de um computador para outro e, acreditando que isso fosse algo rotineiro, decidi buscar na Internet os comandos necessários para essa tarefa. Minha surpresa foi, que aparentemente, as pessoas somente exportam uma chave por vez, me dando a sensação de nunca precisarem exportar ou importar todas as chaves existentes.

Não tenho muitas chaves cadastradas, mas não queria executar a exportação/importação de uma chave por vez, queria algo que fizesse tudo de uma vez e aí, depois de um certo tempo pesquisando (provavelmente maior do que se tivesse feito uma a uma), cheguei aos comandos que tanto busquei.

## Exportando suas chaves

Utilizando o comando abaixo, ao invés de gerar um arquivo por chave, será gerado apenas um arquivo, contendo todas as suas chaves. Em casos onde existem diversas chaves para serem exportadas, isso pode facilitar muito o processo de migração, pois não somente um comando é necessário para exportar todas as chaves de uma vez, como também apenas um arquivo será gerado contendo todas elas.

```bash
gpg --export-options backup -o ~/keyring.gpg --export-secret-keys
```

Durante o processo de exportação, caso suas chaves possuam senhas, elas deverão ser preenchidas durante o processo. Após conclusão, um arquivo chamado **keyring.gpg** será criado na $HOME do usuário.

## Importando suas chaves

O arquivo gerado no processo de exportação deve ser transferido para o computador destino e, para importação, o comando abaixo deve ser executado:

```bash
gpg --import ~/keyring.gpg
```

Assim como no processo de exportação, as senhas para as chaves deverão ser preenchidas. 

## Conclusão

Após o procedimento realizado, suas chaves estarão acessíveis e poderão ser consultadas normalmente utilizando o seguinte comando:

```bash
gpg --list-secret-keys
```

Acredito que possa existir melhores maneiras para realizar desse processo de migração, mas para muitos casos, esse processo simplificado pode ser útil, além de realmente simples de se realizar.

O arquivo gerado no processo de backup, como esperado, pode ser armazenado para usos futuros, mas recomendo ter atenção e cuidado em onde ele será armazenado. Lembre-se: *suas chaves estão ali!*

## Referências:

- [GPG Input and Output (Using the GNU Privacy Guard)](https://www.gnupg.org/documentation/manuals/gnupg/GPG-Input-and-Output.html)