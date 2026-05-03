# Writing Guidelines

This document outlines the specific tone, structure, and formatting used for blog posts in this repository.

## Tone and Voice
- **Technical yet conversational**: Professional and informative but accessible. Use first-person ("I", "we").
- **Relatable**: Start by identifying a common problem or observation.
- **Direct**: Avoid fluff; explain concepts clearly and immediately.

## Structure
1. **Introduction**: Explain the "Why" before the "How".
2. **Body**: Use `##` and `###` subheadings. Include frequent code blocks.
3. **Conclusion**: Summarize findings or provide a closing thought.
4. **References/Links**: Provide links to official documentation.

## Language and Formatting
- Support for English (`.en.md`) and Portuguese (`.pt.md`).
- Translations must maintain the same tone and structure.
- **Images**: Use `/images/posts/` path. Center images using the `#center` fragment: `![Alt text](/path/to/image.png#center)`.
- **Code**: Specify language for syntax highlighting (e.g., `kotlin`, `java`, `bash`).

## Front Matter Template

### English
```yaml
---
title: "Title"
date: YYYY-MM-DDTHH:MM:SSZ
tags: [tag1, tag2]
images: ["/images/posts/image.jpg"]
url: "/posts/YYYY-MM/slug/"
---
```

### Portuguese
```yaml
---
title: "Título"
date: YYYY-MM-DDTHH:MM:SSZ-03:00
tags: [tag1, tag2]
images: ["/images/posts/image.jpg"]
url: "/pt/posts/YYYY-MM/slug/"
---
```

## URL Conventions
- English: `/posts/YYYY-MM/slug/`
- Portuguese: `/pt/posts/YYYY-MM/slug/`
