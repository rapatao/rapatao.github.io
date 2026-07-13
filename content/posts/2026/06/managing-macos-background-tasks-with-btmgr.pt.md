---
title: "BTManager: Uma Forma Melhor de Gerenciar Tarefas em Segundo Plano no macOS"
date: 2026-06-06T10:00:00Z
tags: [macos, go, tools, productivity]
url: "/pt/posts/2026-06/managing-macos-background-tasks-with-btmgr/"
---

Tudo começou com uma pergunta simples: *o que é essa coisa rodando em segundo plano no meu Mac?*

Eu tinha acabado de desinstalar um aplicativo, mas algo dele claramente ainda estava por lá, aparecendo no Monitor de Atividade, consumindo recursos, e se comportando como se nunca tivesse saído. Abri as Configurações do Sistema, fui em Itens de Login e Extensões, e encontrei a entrada. Desabilitei. Problema resolvido, certo?

Nem tanto. Eu ainda não sabia qual executável estava mapeado ali, onde ele ficava no disco, ou se desativar a chave era realmente suficiente. Para responder a essas perguntas, acabei rodando vários comandos no terminal, lendo paredes de JSON e cruzando informações manualmente entre diversas ferramentas.

Foi aí que percebi que o problema não era o aplicativo que eu tinha instalado, era o quão difícil o macOS torna a inspeção de suas próprias informações de tarefas em segundo plano.

## A Lacuna nas Ferramentas Nativas

O macOS expõe tudo o que você precisa saber sobre as tarefas em segundo plano. Os dados estão lá. O problema é que acessá-los exige aprender e combinar várias ferramentas de linha de comando:

```bash
# Listar todos os registros de background task management
sfltool dumpbtm

# Inspecionar o plist de um launch agent
cat ~/Library/LaunchAgents/com.example.agent.plist

# Consultar um serviço em execução
launchctl print system/com.example.agent

# Listar extensões de plugins
pluginkit -m -A -v
```

Cada ferramenta tem um propósito diferente, fala um formato de saída diferente, e responde apenas parte da pergunta. Obter o quadro completo de um único serviço, seu nome, desenvolvedor, Team ID, caminho do executável e configuração, significa rodar vários comandos e montar o resultado mentalmente.

Para uma investigação pontual, é tolerável. Mas é o tipo de coisa que aparece o tempo todo, e o atrito nunca desaparece.

## Construindo Algo Melhor

Decidi construir uma ferramenta que eu realmente quisesse usar. O objetivo era simples: um lugar só onde eu pudesse ver tudo o que o macOS rastreia como tarefa em segundo plano, com detalhes suficientes para entender o que estava olhando, e com controles para agir sobre isso.

O resultado é o [BTManager](https://github.com/rapatao/btmgr).

Ele lê do mesmo banco de dados do Background Task Manager que as Configurações do Sistema utilizam, então os dados são sempre precisos. Mas ao invés de uma lista mínima com chaves, ele entrega um quadro completo:

- **Filtro por tipo**: Login Item, Launch Agent, Daemon, App, Background App Refresh, Developer Tool, QuickLook, Spotlight
- **Busca** por nomes, identificadores e informações do desenvolvedor
- **Inspeção** dos detalhes completos de qualquer serviço, incluindo sua configuração plist em um visualizador embutido
- **Habilitar ou desabilitar** serviços individualmente
- **Remover** serviços por completo, incluindo seus arquivos plist do disco

O que antes exigia vários comandos agora cabe em uma única janela.

## Experimente

Versões pré-compiladas estão disponíveis na [página de releases do GitHub](https://github.com/rapatao/btmgr/releases). Baixe, abra, e sua lista completa de serviços em segundo plano estará bem ali, sem precisar do terminal.

## Considerações Finais

O BTManager não pretende substituir as ferramentas nativas do macOS. É uma camada sobre elas, construída para os momentos em que você só quer entender o que está rodando na sua própria máquina sem gastar dez minutos montando saídas de comandos.

Se isso soa familiar, experimente. O projeto é open source em [github.com/rapatao/btmgr](https://github.com/rapatao/btmgr), e todo feedback é bem-vindo.