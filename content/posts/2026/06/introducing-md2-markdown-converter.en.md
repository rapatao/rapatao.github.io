---
title: "md2: A Simple CLI to Turn Markdown into PDF, HTML, and Text"
date: 2026-06-30T10:00:00Z
tags: [markdown, cli, go, tools, pdf, productivity]
url: "/posts/2026-06/introducing-md2-markdown-converter/"
---

I write almost everything in Markdown. Notes, documentation, blog drafts, README files—if it accepts plain text, it gets Markdown. The problem shows up the moment I need to share that content with someone who expects a PDF, or paste a clean HTML version somewhere that doesn't render Markdown. Suddenly I'm copying text into an online converter, fighting with a heavyweight document editor, or wiring up Pandoc with a pile of flags I never remember.

So I built [md2](https://github.com/rapatao/md2): a small command-line tool that converts a Markdown file into PDF, HTML, or plain text without ceremony. The name is literal—Markdown *to* something else.

> The commands and flags shown here reflect **version 0.3.0**, the current release at the time of writing. The interface may change in future versions, so it's worth checking the [project README](https://github.com/rapatao/md2) to confirm the exact syntax before relying on it.

## The Idea

The goal was a tool I could run without thinking. No config file, no template setup, no remembering arguments. Point it at a Markdown file and get a usable document back:

```bash
md2 input.md
```

That single command produces `input.pdf`. That's the default, because PDF is what people ask for most often. Everything else is one flag away.

## Installation

md2 is written in Go and ships through a few channels, so you can pick whatever fits your setup.

**Homebrew tap (macOS):**

```bash
brew install rapatao/tap/md2
```

**Nix via NUR:** the package is published through the [Nix User Repository](https://nur.nix-community.org/) as `nur.repos.rapatao.md2`. With the NUR overlay in place, you reference it like any other package:

```nix
{
  # bring the overlay in (e.g. from the nur flake input)
  nixpkgs.overlays = [ nur.overlays.default ];

  environment.systemPackages = [
    pkgs.nur.repos.rapatao.md2
  ];
}
```

That's exactly how I install it on my own machines—it sits right next to the rest of my system packages and gets picked up on the next rebuild.

**From source (Go):**

```bash
go install github.com/rapatao/md2@latest
```

There are also prebuilt binaries attached to the latest GitHub release if you'd rather not build anything.

## Basic Usage

The interface is intentionally small. Here are the common cases:

```bash
md2 input.md                 # Markdown -> input.pdf (default)
md2 -f html input.md         # Markdown -> input.html
md2 -f txt input.md          # Markdown -> input.txt (markup stripped)
md2 -f pdf,html input.md     # Multiple formats in one run
md2 -o report.pdf input.md   # Explicit output filename
md2 -f html -stdout input.md # Write to stdout for piping
```

The `-f` flag takes a comma-separated list, so generating several formats from the same source is a single command. The `-o` flag overrides the output name when you don't want it derived from the input.

## The Three Formats

**PDF** is the default and the most interesting one under the hood. md2 uses a two-stage strategy: it renders with pure Go first, which is fast and dependency-free for typical documents. When a document is complex enough that pure Go rendering falls short, it automatically falls back to a headless browser to get the layout right. You don't choose between them—md2 picks the path that produces a correct result.

**HTML** output is self-contained. Local images get embedded as data URIs, so the file you produce is a single artifact you can move around without dragging an assets folder behind it.

**Text** strips the markup while keeping the structure readable—useful when you need the content somewhere that has no business rendering formatting.

## Diagrams

Markdown is increasingly a place where diagrams live, especially [Mermaid](https://mermaid.js.org/). md2 supports rendering them, but it's **off by default**—you opt in per run:

```bash
md2 -render mermaid -f html input.md
```

In HTML, Mermaid blocks render as SVGs. In PDF, they become static images. The reason rendering is off by default is honesty about cost: enabling it pulls in the Mermaid library, and inlining it into self-contained HTML adds around 3 MB. You only pay that when you actually need diagrams.

There's a related `-flatten` flag that converts HTML diagrams into static images, which is handy when the destination can't run JavaScript.

## Using It in CI

If you want to generate PDFs as part of a pipeline—say, turning release notes into a downloadable document—the headless-browser fallback needs a browser available. The `-allow-download` flag lets md2 fetch Chromium automatically in CI environments where it isn't preinstalled:

```bash
md2 -allow-download -f pdf CHANGELOG.md
```

## Why Build Another Converter

Pandoc exists, and it's powerful. That's exactly the point—it's powerful, and power comes with surface area. md2 isn't trying to compete with it. It's trying to be the tool you reach for when you want a PDF of a Markdown file in the next five seconds, with sensible defaults and no reading of documentation.

The architecture is also deliberately open to extension. New formats are added by dropping a converter package under `internal/converter/` that implements a `Converter` interface, so the set of outputs can grow without reshaping the core.

## Wrapping Up

md2 is a small tool with a narrow job: take Markdown, give back something shareable. If you live in Markdown and keep hitting the "now I need this as a PDF" wall, it might save you the same friction it saves me.

The project is open source under the MIT license. Code, issues, and releases are on [GitHub](https://github.com/rapatao/md2)—try it, and let me know what's missing.
