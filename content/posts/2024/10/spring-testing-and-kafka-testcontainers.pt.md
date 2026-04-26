---
title: "Corrigindo problemas de memória ao executar testes no Spring Boot usando Kafka"
date: 2024-10-05T20:00:00Z
tags:
  - tests
  - spring
  - testcontainers
  - kafka
images:
  - "/images/posts/pexels-bentonphotocinema-1095601.jpg"
url: "/pt/posts/2024-10/corrigindo-problemas-de-memoria-ao-executar-testes-no-spring-boot-usando-kafka/"
---

Recentemente, enfrentei um problema em uma aplicação onde os testes estavam demorando muito para executar. Após verificar os motivos, descobri que o Kafka embarcado (embedded) fornecido pelo Spring estava consumindo muita memória, dificultando que o GC (Garbage Collector) liberasse espaço para permitir que todos os testes restantes fossem executados.

Aquela solução embarcada funcionou bem no início do projeto, onde poucos casos de teste precisavam realmente usar esse recurso para validar seus casos de uso. Assim que o projeto cresce e mais casos de teste exigem o uso desse recurso, um problema na execução dos testes começa a aparecer, e o tempo de execução começa a aumentar drasticamente.

![please sir, can I have some more memory?](/images/posts/please-sir-can-i-have-some-more-memory.png#center)

Ok, o problema foi identificado, então como pode ser corrigido? Inicialmente, pensei: vamos aumentar a memória alocada para rodar esses testes e isso resolverá o problema! Mas quanta memória devo adicionar? Será à prova de futuro? Mais testes serão adicionados em breve, e esse problema ocorrerá novamente?

Depois de pensar um pouco, lembrei que uso `testcontainers` em outras aplicações e também em meus projetos em Golang, então decidi tentar usá-lo nesta aplicação.

## Adicionando testcontainers ao projeto

Como de costume, fui à documentação oficial para ler sobre a integração e, tristemente, descobri que, para usá-la, uma mudança considerável seria necessária.

Para usar a solução embarcada, apenas uma anotação é necessária, mas agora, seria necessário não apenas uma anotação, mas também algumas linhas de código para permitir a sobrescrita das URLs padrão de bootstrap do Kafka presentes no contexto do Spring.

Para dar contexto, cada classe de teste que requer Kafka adiciona uma única anotação descrevendo o tópico usado no teste.

```kotlin
@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = ["topic-name"])
public class CasesTests {
    // testing code
}
```

O próximo passo é substituí-la pela implementação do `testcontainers`; cada classe de teste deve agora ter o seguinte código, que não incluía a criação do tópico, essencial na maioria dos casos de uso.

```kotlin

@SpringBootTest
@Testcontainers
public class CasesTests {

    companion object {
        @Container
        val kafka = KafkaContainer(
            DockerImageName.parse("apache/kafka:latest")
        );

        @DynamicPropertySource
        @JvmStatic
        fun overrideProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.kafka.bootstrap-servers", kafka.bootstrapServers);
        }
    }
    // testing code
}
```

Embora não parecesse muito código e provavelmente pudesse ser compartilhado entre as classes de teste compondo o companion object, ainda havia o problema de criar o tópico exigido em cada caso de teste.

Você pode estar começando a se perguntar como resolver todos esses “problemas”, certo? Continue lendo e você terá a resposta.

## Vamos usar o JUnit em vez disso

Em [este post]({{% ref "/posts/2022/01/construindo-testes-com-kotlin-junit-mockk" %}}), mencionei que o JUnit tem algumas anotações úteis que nos permitem executar operações antes ou depois de nossos casos de teste. Essas são as anotações:

- `@BeforeEach`: executa antes de cada método
- `@BeforeAll`: executa antes de todos os métodos de teste
- `@AfterEach`: executa após cada método
- `@AfterAll`: executa após todos os métodos de teste

Neste ponto, você provavelmente está pensando que essas anotações poderiam ser usadas para criar os tópicos, e você está correto! Ao usá-las antes de executar os casos de teste, os tópicos necessários poderiam ser criados, mas ainda exigiria adicionar muitas instruções às classes existentes, e eu preferia não fazer isso.

Então, me veio à mente implementar um callback personalizado do JUnit que lerá os metadados definidos em uma anotação para lidar com tudo isso. Parece ótimo, certo? Vamos começar a codificar.

Primeiro, criei a seguinte anotação:

```kotlin
annotation class EnableKafkaTopics(
    val partitions: Int = 1,
    vararg val topics: String = [],
)
```

Como você pode ver, ela tem basicamente a mesma assinatura da `@EmbeddedKafka`, o que me permitiria apenas substituir a anotação e ainda ter tudo funcionando como antes.

Agora que a anotação está definida, vamos criar a extensão JUnit para ler isso e criar os tópicos.

```kotlin
class KafkaTopicsExtension : BeforeEachCallback {
    override fun beforeEach(context: ExtensionContext) {
        // encontrar a anotação da classe de teste
        val definition = TestContextAnnotationUtils.findMergedAnnotation(
            context.testClass.get(),
            EnableKafkaTopics::class.java,
        )!!

        // definir a criação do tópico usando os metadados da anotação
        val topics = definition.topics.map { NewTopic(it, definition.partitions, 1) }

        // obter o bean KafkaAdmin do contexto do Spring
        val kafkaAdmin = SpringExtension.getApplicationContext(context).getBean(KafkaAdmin::class.java)

        // criar tópicos
        kafkaAdmin.createOrModifyTopics(*topics.toTypedArray())
    }
}
```

Com a extensão implementada, mudei a anotação `EnableKafkaTopics` para referenciar a extensão desejada.

```kotlin
@ExtendWith(KafkaTopicsExtension::class)
annotation class EnableKafkaTopics(
    val partitions: Int = 1,
    vararg val topics: String = [],
)
```

Nesse momento, esqueci completamente que deveria adicionar à classe de teste o companion object para iniciar o container e apenas fui ao código e o substituí dentro da minha nova anotação `EnableKafkaTopics`.

Como você pode imaginar, o teste falhou porque nenhum container foi iniciado, nenhum tópico foi criado e, consequentemente, o caso de teste falhou.

Então, lá vou eu. Como alterá-lo em todas as classes apenas para teste seria mais difícil, abri uma única classe de teste, adicionei a declaração do companion object para iniciar o container e _voilà_, todos os testes nela passaram.

Depois de todo esse trabalho, fiquei feliz que funcionou, mas queria tornar mais fácil substituir a solução embarcada por esta nova e, de alguma forma, torná-la à prova de futuro, simplificando seu uso em novas classes de teste.

## Customizadores de Contexto do Spring são a solução

Foi o que pensei na época, então acabei criando um customizador que inicializa o container e substitui o endereço de bootstrap no contexto do Spring.

O seguinte código faz exatamente isso:

```kotlin
class KafkaContainerContextCustomizerFactory : ContextCustomizerFactory {
    override fun createContextCustomizer(
        testClass: Class<*>,
        configAttributes: MutableList<ContextConfigurationAttributes>
    ): ContextCustomizer? {
        // tentar encontrar a anotação da classe de teste, caso contrário, retorna null sem inicializar o container
        if (TestContextAnnotationUtils.findMergedAnnotation(testClass, EnableKafkaTopics::class.java) == null) {
            return null
        }

        // criar kafka e iniciar container
        val container = KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:latest"))
        container.start()

        // criar e retornar o customizador de contexto
        return KafkaContainerContextCustomizer(container)
    }

    inner class KafkaContainerContextCustomizer(val container: KafkaContainer) : ContextCustomizer {
        override fun customizeContext(
            context: ConfigurableApplicationContext,
            mergedConfig: MergedContextConfiguration
        ) {
            // adicionar os servidores de bootstrap no topo das propriedades
            context.environment.propertySources.addFirst(
                MapPropertySource(
                    "kafka", mapOf("spring.kafka.bootstrap-servers" to container.bootstrapServers),
                ),
            )
        }
    }
}
```

É necessário criar um `spring.factories` dentro da pasta `META-INF` para ativar esta factory. O conteúdo do arquivo deve ser algo como:

```
org.springframework.test.context.ContextCustomizerFactory=\
  com.rapatao.www.KafkaContainerContextCustomizerFactory
```

À primeira vista, pensei ter encontrado a solução perfeita, então substituí a anotação em todos os casos de teste e executei a build para garantir que todos os testes passariam.

À medida que começava a rodar, a maioria dos testes executava com sucesso, mas em certo ponto, eles começaram a falhar por falta de memória. Comecei a investigação porque, na minha mente, isso não deveria acontecer até que percebi o problema.

Eu estava iniciando os containers, mas nunca os parando porque esperava que o controlador do `testcontainers` os parasse automaticamente, o que ele realmente faz, mas apenas quando a execução termina, o que no meu caso é quando todos os testes finalizam.

Nesse ponto, eu estava muito cansado, então decidi ser simples. Como era usado apenas para teste, criei um mapa estático para armazenar a classe de teste e sua instância de container e estendi o `KafkaTopicsExtension` para parar esse container após a execução do teste.

Funcionou, mas não cobrirei essas mudanças no artigo porque, enquanto reescrevia a solução para adicionar trechos de código a este texto, acabei encontrando uma solução melhor.

## A Configuração de Teste do Spring estava lá para me ajudar

Semelhante ao `@Configuration` que é normalmente usado para criar beans e expor outros tipos de customizações no código produtivo, o `@TestConfiguration` faz o mesmo, mas é usado no código de teste.

O Spring Boot tem um pacote de integração que permite sobrescrever essas variáveis simplesmente adicionando a anotação `@ServiceConnection`. Então, para inicializar um container Kafka, tudo o que preciso fazer é adicionar o seguinte código:

```kotlin
class KafkaContainerConfiguration {
    @Bean
    @ServiceConnection // Faz toda a mágica
    fun kafkaContainer(): KafkaContainer {
        return KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:latest"))
    }
}
```

Como você provavelmente notou, o snippet fornecido não está anotando a classe com `@TestConfiguration` e isso foi intencional, para que possamos decidir se habilitamos ou não a integração com Kafka, já que alguns de nossos testes não exigem Kafka para rodar e ativá-los tornaria tudo mais lento.

Como todos os testes que exigem o container Kafka são anotados com `@EnableKafkaTopics`, podemos adaptá-lo para importar essa configuração, o que ativa o container quando necessário.

O código final para a anotação é:

```kotlin
@Import(KafkaContainerConfiguration::class)
@ExtendWith(KafkaTopicsExtension::class)
annotation class EnableKafkaTopics(
    val partitions: Int = 1,
    vararg val topics: String = [],
)
```

## Conclusão

O problema em si foi desafiador, algo que nunca experimentei em minha vida de programador, e fiquei muito feliz em ler a documentação de algo que não usava há tanto tempo e que teve tantas mudanças.

Esqueci algumas coisas básicas que geralmente recomendo a todos com quem falo, que é primeiro ler sobre o tópico na documentação oficial da ferramenta que você está usando.

Na minha situação, isso provavelmente teria me impedido de criar o customizador que criei, usando em vez disso a anotação que o pacote de teste do Spring Boot fornece exatamente para esse propósito.

Em minha defesa, como se eu precisasse de uma, li a documentação do `testcontainers` e lá não encontrei nada sobre essa anotação que acabei de descobrir ao escrever este post. Provavelmente é algo relativamente novo, mas não vou descobrir; não há razão para isso.

De qualquer forma, tudo o que aconteceu foi bom; me ajudou a reaprender tópicos que eu tinha esquecido e também me ajudou a escrever um texto para este site, algo que não fazia há quase um ano.

Espero que tenha ajudado você a aprender, ou pelo menos revisar, alguns dos tópicos apresentados neste post. Pode ser uma boa experiência de aprendizado se você nunca criou uma extensão JUnit personalizada ou até mesmo declarou uma Factory de Customizador do Spring.

Obrigado por ler; até logo.

## Referências

### Links

* [@EmbeddedKafka Annotation with JUnit5](https://docs.spring.io/spring-kafka/reference/testing.html#embedded-kafka-junit5)
* [Testing Spring Boot Kafka Listener using Testcontainers](https://testcontainers.com/guides/testing-spring-boot-kafka-listener-using-testcontainers/)
* [Context Configuration with Context Initializers](https://docs.spring.io/spring-framework/reference/testing/testcontext-framework/ctx-management/initializers.html)
* [Annotation Interface TestConfiguration](https://docs.spring.io/spring-boot/api/java/org/springframework/boot/test/context/TestConfiguration.html)

### Plugins Gradle e dependências

```gradle
plugins {
    id 'org.jetbrains.kotlin.jvm' version '1.9.25'
    id 'org.jetbrains.kotlin.plugin.spring' version '1.9.25'
    id 'org.springframework.boot' version '3.3.4'
    id 'io.spring.dependency-management' version '1.1.6'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter'
    implementation 'org.jetbrains.kotlin:kotlin-reflect'
    implementation 'org.springframework.kafka:spring-kafka'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.boot:spring-boot-testcontainers'
    testImplementation 'org.testcontainers:junit-jupiter'
    testImplementation 'org.testcontainers:kafka'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}
```
