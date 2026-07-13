---
title: "md2: Uma CLI Simples para Converter Markdown em PDF, HTML e Texto"
date: 2026-06-30T10:00:00Z
tags: [markdown, cli, go, tools, pdf, productivity]
url: "/pt/posts/2026-06/introducing-md2-markdown-converter/"
---

Escrevo quase tudo em Markdown. Anotações, documentação, rascunhos de posts, arquivos README-se aceita texto puro, vira Markdown. O problema aparece no momento em que preciso compartilhar esse conteúdo com alguém que espera um PDF, ou colar uma versão limpa em HTML em algum lugar que não renderiza Markdown. De repente estou copiando texto para um conversor online, brigando com um editor de documentos pesado, ou montando o Pandoc com um monte de flags que nunca lembro.

Então construí o [md2](https://github.com/rapatao/md2): uma pequena ferramenta de linha de comando que converte um arquivo Markdown em PDF, HTML ou texto puro sem cerimônia. O nome é literal-Markdown *para* outra coisa.

> Os comandos e flags mostrados aqui refletem a **versão 0.3.0**, o release atual no momento em que escrevo. A interface pode mudar em versões futuras, então vale conferir o [README do projeto](https://github.com/rapatao/md2) para confirmar a sintaxe exata antes de depender dela.

## A Ideia

O objetivo era uma ferramenta que eu pudesse rodar sem pensar. Sem arquivo de configuração, sem setup de template, sem decorar argumentos. Aponta para um arquivo Markdown e recebe um documento utilizável de volta:

```bash
md2 input.md
```

Esse único comando produz `input.pdf`. Esse é o padrão, porque PDF é o que as pessoas pedem com mais frequência. Todo o resto está a uma flag de distância.

## Instalação

O md2 é escrito em Go e é distribuído por alguns canais, então você escolhe o que encaixa no seu setup.

**Tap do Homebrew (macOS):**

```bash
brew install rapatao/tap/md2
```

**Nix via NUR:** o pacote é publicado através do [Nix User Repository](https://nur.nix-community.org/) como `nur.repos.rapatao.md2`. Com o overlay do NUR no lugar, você o referencia como qualquer outro pacote:

```nix
{
  # traz o overlay (por exemplo, a partir do input flake do nur)
  nixpkgs.overlays = [ nur.overlays.default ];

  environment.systemPackages = [
    pkgs.nur.repos.rapatao.md2
  ];
}
```

É exatamente assim que eu o instalo nas minhas próprias máquinas-ele fica ao lado do resto dos pacotes do sistema e é incluído no próximo rebuild.

**A partir do código (Go):**

```bash
go install github.com/rapatao/md2@latest
```

Também há binários pré-compilados anexados ao release mais recente no GitHub, caso você prefira não compilar nada.

## Uso Básico

A interface é propositalmente pequena. Aqui estão os casos comuns:

```bash
md2 input.md                 # Markdown -> input.pdf (padrão)
md2 -f html input.md         # Markdown -> input.html
md2 -f txt input.md          # Markdown -> input.txt (marcação removida)
md2 -f pdf,html input.md     # Múltiplos formatos em uma execução
md2 -o report.pdf input.md   # Nome de saída explícito
md2 -f html -stdout input.md # Escreve no stdout para piping
```

A flag `-f` aceita uma lista separada por vírgulas, então gerar vários formatos da mesma fonte é um único comando. A flag `-o` sobrescreve o nome de saída quando você não quer que ele seja derivado da entrada.

## Os Três Formatos

**PDF** é o padrão e o mais interessante por baixo dos panos. O md2 usa uma estratégia em dois estágios: primeiro renderiza com Go puro, que é rápido e sem dependências para documentos típicos. Quando um documento é complexo o suficiente para a renderização em Go puro não dar conta, ele recorre automaticamente a um navegador headless para acertar o layout. Você não escolhe entre os dois-o md2 escolhe o caminho que produz um resultado correto.

**HTML** gera saída autocontida. Imagens locais são embutidas como data URIs, então o arquivo produzido é um único artefato que você pode mover por aí sem arrastar uma pasta de assets atrás.

**Texto** remove a marcação mantendo a estrutura legível-útil quando você precisa do conteúdo em algum lugar que não tem motivo para renderizar formatação.

## Diagramas

Markdown é cada vez mais um lugar onde diagramas vivem, especialmente o [Mermaid](https://mermaid.js.org/). O md2 suporta renderizá-los, mas isso está **desligado por padrão**-você habilita por execução:

```bash
md2 -render mermaid -f html input.md
```

No HTML, blocos Mermaid renderizam como SVGs. No PDF, viram imagens estáticas. O motivo de a renderização estar desligada por padrão é honestidade quanto ao custo: habilitá-la puxa a biblioteca Mermaid, e embuti-la no HTML autocontido adiciona cerca de 3 MB. Você só paga isso quando realmente precisa de diagramas.

Há uma flag relacionada, `-flatten`, que converte diagramas HTML em imagens estáticas, útil quando o destino não consegue rodar JavaScript.

## Usando em CI

Se você quer gerar PDFs como parte de um pipeline-por exemplo, transformar release notes em um documento para download-o fallback do navegador headless precisa de um navegador disponível. A flag `-allow-download` faz o md2 baixar o Chromium automaticamente em ambientes de CI onde ele não está pré-instalado:

```bash
md2 -allow-download -f pdf CHANGELOG.md
```

## Por Que Construir Mais um Conversor

O Pandoc existe, e é poderoso. É exatamente esse o ponto-é poderoso, e poder vem com superfície. O md2 não está tentando competir com ele. Está tentando ser a ferramenta que você usa quando quer um PDF de um arquivo Markdown nos próximos cinco segundos, com padrões sensatos e sem ler documentação.

A arquitetura também é deliberadamente aberta a extensão. Novos formatos são adicionados ao colocar um pacote conversor em `internal/converter/` que implementa a interface `Converter`, então o conjunto de saídas pode crescer sem reformular o núcleo.

## Encerrando

O md2 é uma ferramenta pequena com um trabalho específico: pega Markdown, devolve algo compartilhável. Se você vive em Markdown e fica esbarrando na parede do "agora preciso disso como PDF", ele pode te poupar o mesmo atrito que poupa a mim.

O projeto é open source sob a licença MIT. Código, issues e releases estão no [GitHub](https://github.com/rapatao/md2)-experimente, e me diga o que está faltando.
