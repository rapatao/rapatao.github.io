---
title: "Contract-First VS Code-First API Documentation"
date: 2023-10-08T09:00:00Z
tags:
  - api
  - api design
  - documentation
url: "/posts/2023-10/contract-first-vs-code-first-api-documentation/"
---

API development is a crucial part of modern software development. Designing clear, robust, and easy-to-use APIs not only
optimizes the development process but also enhances the developer experience. Two dominant methodologies define how
teams approach this: **Contract-First** and **Code-First**. Choosing between them affects collaboration, tooling,
release pace, and long-term maintainability.

## Contract-First API Documentation

Contract-first (also called **design-first** or **API-first**) means the API definition is written before any
implementation begins. Teams agree on endpoints, request/response schemas, data types, error codes, and versioning
strategy upfront. This contract becomes the single source of truth.

The contract is typically expressed in a machine-readable format:

- **[OpenAPI (Swagger)](https://swagger.io)**, the most widely adopted standard, used for REST APIs
- **[RAML](https://raml.org)**, YAML-based, focused on API modeling
- **[API Blueprint](https://apiblueprint.org)**, Markdown-based, human-friendly
- **[AsyncAPI](https://www.asyncapi.com)**, equivalent of OpenAPI for event-driven and message-based APIs

A minimal OpenAPI contract for a user endpoint looks like this:

```yaml
openapi: 3.0.3
info:
  title: User API
  version: 1.0.0
paths:
  /users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        "404":
          description: User not found
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

### Benefits

- **Parallel development**: frontend, backend, and QA teams can work simultaneously. The contract enables mock servers
  (e.g., [Prism](https://stoplight.io/open-source/prism), [WireMock](https://wiremock.org)) that simulate the real API
  before a single line of implementation exists.
- **Consumer alignment**: consumers of the API review and sign off on the contract before work begins, reducing
  integration surprises late in the project.
- **Stable documentation**: docs are always accurate because the contract is the spec, not generated from potentially
  drifted code.
- **Code generation**: server stubs and client SDKs can be generated from the spec using tools like
  [OpenAPI Generator](https://openapi-generator.tech) or [Swagger Codegen](https://swagger.io/tools/swagger-codegen/).

### Challenges

- **Upfront cost**: designing a thorough contract requires time and domain knowledge before development can start.
- **Rigidity**: changes to the contract require coordination across all consuming teams, a good discipline, but
  sometimes a bottleneck in fast-moving projects.
- **Tooling overhead**: teams need to adopt and maintain spec files, editors, and validation pipelines.

## Code-First API Documentation

The code-first approach inverts the process: developers write implementation code first and the API documentation is
generated automatically from it, typically via annotations or reflection at build time or runtime.

Popular frameworks that support this natively include:

- **Spring Boot + [Springdoc OpenAPI](https://springdoc.org)**, generates OpenAPI 3 docs from `@RestController`
  annotations (Java/Kotlin)
- **[FastAPI](https://fastapi.tiangolo.com)**, generates OpenAPI docs automatically from Python type hints
- **ASP.NET Core + [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)**, OpenAPI generation
  for .NET
- **[NestJS](https://docs.nestjs.com/openapi/introduction)**, OpenAPI generation for Node.js via decorators

A code-first example using Spring Boot annotations:

```kotlin
@RestController
@RequestMapping("/users")
class UserController(private val userService: UserService) {

    @Operation(summary = "Get user by ID")
    @ApiResponse(responseCode = "200", description = "User found")
    @ApiResponse(responseCode = "404", description = "User not found")
    @GetMapping("/{id}")
    fun getUser(@PathVariable id: String): ResponseEntity<UserDto> =
        userService.findById(id)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
}
```

The OpenAPI spec is then generated and served automatically (e.g., at `/v3/api-docs`).

### Benefits

- **Always in sync**: documentation is derived from the actual code, so it cannot drift out of date as long as
  annotations are maintained.
- **Faster to start**: no design phase is required, teams can begin coding immediately and let the spec emerge.
- **Lower tooling friction**: most frameworks handle generation transparently; developers work in familiar code.

### Challenges

- **Design as an afterthought**: without an upfront design step, API shape tends to reflect internal implementation
  details rather than consumer needs, leading to leaky abstractions.
- **Breaking changes**: because the contract is implicit, it is easier to introduce breaking changes without noticing.
  Versioning discipline must be enforced manually.
- **Parallel development is harder**: frontend or mobile teams must wait for working backend code before they can
  integrate, unless mocks are set up manually.

## When to Choose Which

| Scenario                                       | Recommended Approach      |
|------------------------------------------------|---------------------------|
| Multiple consuming teams or external consumers | Contract-First            |
| Public APIs with SLA and versioning guarantees | Contract-First            |
| Microservices requiring inter-team coordination | Contract-First            |
| Rapid internal prototyping or MVP              | Code-First                |
| Small team, single consumer                    | Code-First                |
| Existing codebase with no prior spec           | Code-First (to bootstrap) |

## Consumer-Driven Contract Testing

Regardless of approach, **contract testing** can verify that providers and consumers stay aligned over time.
[Pact](https://docs.pact.io) is the most widely used framework for this: consumers define the interactions they expect
from the provider, and those expectations are verified against the actual provider implementation in CI. This catches
breaking changes before deployment, complementing both contract-first and code-first workflows.

## Conclusion

Both approaches produce valid, documented APIs, but they make different trade-offs. Contract-first invests upfront in
design and alignment, rewarding teams with parallel development, stable contracts, and consumer-driven design. Code-first
prioritizes speed and simplicity, rewarding small teams and rapid iteration. For long-lived public APIs or services with
many consumers, contract-first is generally the safer foundation. For internal tools and early-stage products, code-first
gets you moving faster. Many mature teams use a hybrid: code-first during prototyping, then lock a contract once the API
stabilizes.

## References

- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [AsyncAPI Specification](https://www.asyncapi.com/docs/reference/specification/latest)
- [Pact, Consumer-Driven Contract Testing](https://docs.pact.io)
- [OpenAPI Generator](https://openapi-generator.tech)
- [Springdoc OpenAPI](https://springdoc.org)