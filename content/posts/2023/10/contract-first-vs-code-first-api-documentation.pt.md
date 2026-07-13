---
title: "Documentação de API Contract-First VS Code-First"
date: 2023-10-08T09:00:00Z
tags:
  - api
  - api design
  - documentation
url: "/pt/posts/2023-10/contract-first-vs-code-first-api-documentation/"
---

O desenvolvimento de APIs é uma parte crucial do desenvolvimento de software moderno. Projetar APIs claras, robustas e
fáceis de usar não apenas otimiza o processo de desenvolvimento, mas também melhora a experiência do desenvolvedor. Duas
metodologias dominantes definem como as equipes abordam isso: **Contract-First** e **Code-First**. A escolha entre elas
afeta a colaboração, as ferramentas, o ritmo de entrega e a manutenibilidade a longo prazo.

## Documentação de API Contract-First

Contract-first (também chamado de **design-first** ou **API-first**) significa que a definição da API é escrita antes
de qualquer implementação começar. As equipes concordam com endpoints, schemas de requisição/resposta, tipos de dados,
códigos de erro e estratégia de versionamento antes de escrever código. Esse contrato se torna a única fonte de verdade.

O contrato é tipicamente expresso em um formato legível por máquina:

- **[OpenAPI (Swagger)](https://swagger.io)**, o padrão mais amplamente adotado, usado para APIs REST
- **[RAML](https://raml.org)**, baseado em YAML, focado em modelagem de APIs
- **[API Blueprint](https://apiblueprint.org)**, baseado em Markdown, de fácil leitura humana
- **[AsyncAPI](https://www.asyncapi.com)**, equivalente ao OpenAPI para APIs orientadas a eventos e baseadas em
  mensagens

Um contrato OpenAPI mínimo para um endpoint de usuário se parece com isto:

```yaml
openapi: 3.0.3
info:
  title: User API
  version: 1.0.0
paths:
  /users/{id}:
    get:
      summary: Buscar usuário por ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Usuário encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        "404":
          description: Usuário não encontrado
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string
```

### Benefícios

- **Desenvolvimento paralelo**: equipes de frontend, backend e QA podem trabalhar simultaneamente. O contrato habilita
  servidores mock (ex: [Prism](https://stoplight.io/open-source/prism), [WireMock](https://wiremock.org)) que simulam
  a API real antes de uma única linha de implementação existir.
- **Alinhamento com consumidores**: os consumidores da API revisam e aprovam o contrato antes do trabalho começar,
  reduzindo surpresas de integração no final do projeto.
- **Documentação estável**: os docs são sempre precisos porque o contrato é a especificação, não gerado de código que
  pode ter divergido.
- **Geração de código**: stubs de servidor e SDKs de cliente podem ser gerados a partir da spec usando ferramentas como
  [OpenAPI Generator](https://openapi-generator.tech) ou [Swagger Codegen](https://swagger.io/tools/swagger-codegen/).

### Desafios

- **Custo inicial**: projetar um contrato completo exige tempo e conhecimento de domínio antes que o desenvolvimento
  possa começar.
- **Rigidez**: mudanças no contrato exigem coordenação entre todas as equipes consumidoras, uma boa disciplina, mas
  às vezes um gargalo em projetos que evoluem rapidamente.
- **Overhead de ferramentas**: as equipes precisam adotar e manter arquivos de spec, editores e pipelines de validação.

## Documentação de API Code-First

A abordagem code-first inverte o processo: os desenvolvedores escrevem o código de implementação primeiro e a
documentação da API é gerada automaticamente a partir dele, tipicamente via anotações ou reflexão em tempo de build ou
execução.

Frameworks populares que suportam isso nativamente incluem:

- **Spring Boot + [Springdoc OpenAPI](https://springdoc.org)**, gera docs OpenAPI 3 a partir de anotações
  `@RestController` (Java/Kotlin)
- **[FastAPI](https://fastapi.tiangolo.com)**, gera docs OpenAPI automaticamente a partir de type hints Python
- **ASP.NET Core + [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)**, geração de OpenAPI
  para .NET
- **[NestJS](https://docs.nestjs.com/openapi/introduction)**, geração de OpenAPI para Node.js via decorators

Um exemplo code-first usando anotações Spring Boot:

```kotlin
@RestController
@RequestMapping("/users")
class UserController(private val userService: UserService) {

    @Operation(summary = "Buscar usuário por ID")
    @ApiResponse(responseCode = "200", description = "Usuário encontrado")
    @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    @GetMapping("/{id}")
    fun getUser(@PathVariable id: String): ResponseEntity<UserDto> =
        userService.findById(id)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
}
```

A spec OpenAPI é então gerada e servida automaticamente (ex: em `/v3/api-docs`).

### Benefícios

- **Sempre sincronizado**: a documentação é derivada do código real, portanto não pode ficar desatualizada enquanto as
  anotações forem mantidas.
- **Início mais rápido**: nenhuma fase de design é necessária, as equipes podem começar a codificar imediatamente e
  deixar a spec emergir.
- **Menor fricção de ferramentas**: a maioria dos frameworks trata a geração de forma transparente; os desenvolvedores
  trabalham em código familiar.

### Desafios

- **Design como pensamento posterior**: sem uma etapa de design prévia, a forma da API tende a refletir detalhes
  internos de implementação em vez de necessidades do consumidor, levando a abstrações vazadas.
- **Mudanças que quebram contratos**: como o contrato é implícito, é mais fácil introduzir mudanças incompatíveis sem
  perceber. A disciplina de versionamento precisa ser aplicada manualmente.
- **Desenvolvimento paralelo mais difícil**: equipes de frontend ou mobile precisam aguardar código backend funcional
  antes de integrar, a menos que mocks sejam configurados manualmente.

## Quando Escolher Cada Abordagem

| Cenário                                                   | Abordagem Recomendada     |
|-----------------------------------------------------------|---------------------------|
| Múltiplas equipes consumidoras ou consumidores externos   | Contract-First            |
| APIs públicas com SLA e garantias de versionamento        | Contract-First            |
| Microsserviços que exigem coordenação entre equipes       | Contract-First            |
| Prototipagem interna rápida ou MVP                        | Code-First                |
| Equipe pequena, único consumidor                          | Code-First                |
| Base de código existente sem spec prévia                  | Code-First (para iniciar) |

## Testes de Contrato Orientados ao Consumidor

Independentemente da abordagem, os **testes de contrato** podem verificar que provedores e consumidores permanecem
alinhados ao longo do tempo. O [Pact](https://docs.pact.io) é o framework mais utilizado para isso: os consumidores
definem as interações que esperam do provedor, e essas expectativas são verificadas contra a implementação real do
provedor no CI. Isso detecta mudanças incompatíveis antes do deploy, complementando tanto workflows contract-first
quanto code-first.

## Conclusão

Ambas as abordagens produzem APIs válidas e documentadas, mas fazem trade-offs diferentes. Contract-first investe
antecipadamente em design e alinhamento, recompensando equipes com desenvolvimento paralelo, contratos estáveis e design
orientado ao consumidor. Code-first prioriza velocidade e simplicidade, recompensando equipes pequenas e iteração
rápida. Para APIs públicas de longa vida ou serviços com muitos consumidores, contract-first é geralmente a base mais
segura. Para ferramentas internas e produtos em estágio inicial, code-first faz você avançar mais rápido. Muitas equipes
maduras usam uma abordagem híbrida: code-first durante a prototipagem e, em seguida, consolidam um contrato quando a
API estabiliza.

## Referências

- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [AsyncAPI Specification](https://www.asyncapi.com/docs/reference/specification/latest)
- [Pact, Consumer-Driven Contract Testing](https://docs.pact.io)
- [OpenAPI Generator](https://openapi-generator.tech)
- [Springdoc OpenAPI](https://springdoc.org)