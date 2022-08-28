---
title: "O que são Flaky Tests e, porque corrigi-los!"
date: 2022-08-28T12:00:00-03:00
tags:
    - tests
images: 
  - src: "/images/posts/flaky-pipeline.png"
    alt: "O que são Flaky Tests e, porque corrigi-los!"
url: "/pt/posts/2022-08/o-que-sao-flaky-tests-e-porque-corrigi-los/"
---

Construir testes é, seguramente, uma das tarefas mais difíceis e que mais consomem o tempo de um desenvolvedor, além de normalmente gerarem mais linhas de código que a funcionalidade adicionada. Isso ocorre devido aos diversos cenários que precisam, ou deveriam, ser verificados.

*Flaky Tests*, são basicamente casos de testes criados para verificação de um cenário, porém, podem apresentar aleatoriamente resultados de sucesso e falha, sem ter sofrido qualquer alteração, nem no caso de teste, nem no código testado.

Basicamente, são aqueles casos de testes que falham sem motivo e, em nova execução, concluem com sucesso.

Diversos motivos podem fazer com que um caso de teste seja inconsistente, vamos tratar algumas das principais causas que já experienciei a seguir.

### Quando a ordem de execução importa

![Quando a ordem de execução importa](/images/posts/pexels-shy-sol-65562.jpg#floatleft)

É comum construir uma classe e adicionar métodos para os diversos casos a serem testados, porém, principalmente quando fazemos acesso a bases de dados ou classes que armazenam o estado, a execução de um caso de teste pode alterar esses dados persistidos e, consequentemente, impactar o resultado desejado no próximo teste executado.

Talvez esse seja um dos casos mais fáceis de solucionar, onde podemos apenas definir a ordem de execução destes casos de teste, ou mesmo executar uma limpeza e preparação dos dados antes da execução de cada caso de teste.

Particularmente, entendo que um caso de teste não deveria impactar outro caso e normalmente tendo a utilizar rotinas de limpeza e preparação dos dados antes da execução de cada caso. Porém, entendo que alguns casos, definir uma ordem de execução poderia reduzir muito o esforço necessário para construção dos casos de testes.

Um exemplo onde a ordem possa fazer sentido, seria para testar um *CRUD*, onde se pode criar um primeiro caso onde criamos o recurso, no segundo o recuperamos, no terceiro, o atualizaríamos e por último, o apagaríamos. Já para casos de validação de regras de negócio, como realização de cálculos ou outras verificações complexas, acredito que rotinas de limpeza e preparação seja a melhor opção, pois simplifica o entendimento do estado inicial sem a necessidade de analisarmos o caso de teste anterior, desconsiderando, que muitas vezes, o teste anteriormente executado não possui muita relação com o estado inicial a ser testado no caso atual.

Não acredito que exista um certo ou errado, mas sim abordagens diferentes. O mais importante é entender suas diferenças e identificar onde uma solução pode ser melhor aplicada.

### Datas e fuso horários são sempre complicadas

![Datas e fuso horários são sempre complicadas](/images/posts/pexels-andrey-grushnikov-707676.jpg#floatright)

Se você tem uma equipe que trabalha em localidades diversas, com fusos horários diferentes ou, seu CI/CD está em um fuso diferente do seu, existe uma grande chance de já ter sofrido com problemas de testes que fazem validação de datas. Esse problema também é comum de acontecer em anos bissextos ou inícios de mês.

Existem diversas maneiras de resolver esse problema, mas no geral, consiste em modificar como é realizado a validação das datas, para ser possível controlar o "relógio", ou seja, definir o instante atual e, consequentemente, ter controle de validações que envolvem data.

Em Java, por exemplo, ao recuperar o momento atual, é comum utilizarmos o seguinte bloco:

```java
final Instant now = Instant.now();
```

Porém, é possível controlar o "relógio", alterando para o seguinte código:

```java
final Instant now = Instant.now(clock);
```

Com isso, em nossos casos de teste, basta construirmos um *mock* de `java.time.Clock` para retornar uma data específica, ou seja, termos o controle do "relógio" e garantir validação de um cenário específico no caso de teste, independente de onde do fuso ou dia em que esteja sendo executado o devido caso.

### Sincronismo no Assíncrono

![Sincronismo no Assíncrono](/images/posts/pexels-connor-martin-5526115.jpg#floatleft)

O uso de métodos assíncronos tem cada vez mais se tornado rotina no desenvolvimento de aplicações, dado que em vários casos, alguns processos poderiam ser executados em paralelo, sem bloquear outras operações ou mesmo ações do usuário.

Porém, garantir que um método assíncrono executou alguma operação conforme desejado, muitas vezes é uma tarefa difícil, visto que, por executar em outro momento, não temos controle de quando ela será realizada, o que, dependendo da capacidade computacional, pode gerar falhas por verificações antecipadas. Por exemplo, um método assíncrono deveria persistir uma informação na base de dados, porém, no momento que verificamos, essa inserção ainda não ocorreu, resultando uma falha, porém, algum tempo depois, a informação é inserida corretamente.

A dificuldade neste tipo de teste está em identificar o momento para realizar a verificação de que algo aconteceu, visto que não temos como controlar quando ele irá ocorrer. Existem diversas maneiras para tentar assegurar que o processamento concluiu antes realizar as verificações, a mais comum é também a maneira que acredito ser a que devemos evitar. Ou seja, bloquear o processo por um tempo determinado, usando, por exemplo, o `Thread.sleep(long)` do Java.

O problema nessa abordagem é que, caso o processamento conclua em 1 segundo, mas definimos ali 60 segundos, o caso de teste levará sempre o tempo máximo para concluir e quando replicamos essa abordagem para todos os testes, acabamos por multiplicar o tempo necessário para execução dos testes.

Acredito que nem todas as ferramentas que possa estar utilizando possua suporte para verificação de processos assíncronos, e em determinados casos, pode ser aceitável o uso do método citado anteriormente, mas sempre que possível, devemos optar por abordagens otimizadas que, visam não bloquear o processo por um tempo específico, mas sim até um limite de tempo máximo, realizando as verificações quando estar concluir antecipadamente. 

Um exemplo de ferramenta que oferece suporte para esse tipo de validação seria o *[Mockito](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html#22)* que oferece a verificação com uso de `timeout(long)`, que finaliza a verificação caso esta ocorra até o tempo determinado ou falha, caso não ocorra.

### Testes fim a fim

![Testes fim a fim](/images/posts/pexels-clark-cruz-2911364.jpg#floatright)

Por ser um tipo de teste que realiza a integração com outras aplicações/serviços, ele é naturalmente um *Flaky Test* e dificilmente temos uma solução ideal para esses casos, consequentemente demanda análise para confirmação.

Justamente por se integrar com outros sistemas, temos diversos fatores envolvidos que podem fazer com que um determinado caso de teste não tenha o resultado esperado, o que gera, consequentemente, uma falha de validação. Um exemplo comum nesse tipo de teste, seria uma possível intermitência de rede ou uma simples indisponibilidade do serviço consumido, o que faz com que o caso a ser testado não seja possível, resultando em falha.

Como dito anteriormente, não existe muito o que se fazer nesses casos, construir uma aplicação resiliente, com re-tentativas pode minimizar esses problemas, porém, não é garantia, dependendo da causa do problema. É exatamente por isso, que nesses casos, é sempre importante analisar o problema para identificar se é algo novo, ou seja, devido uma alteração de código, ou algo externo e que não temos como controlar.

Com certeza, grande parte desses testes poderiam ser convertidos para testes que usam ferramentas que nos forneceriam controle dos cenários, permitindo criar simulações para testar algum caso específico/necessário. Muitas vezes, o uso de uma base de dados real poderia ser substituída por um banco em memória ou uma integração a uma *API REST* poderia ser feita para um *mock* criado utilizando *[WireMock](https://wiremock.org/)* ao invés do *endpoint* "real”.

De forma geral, esses testes consomem bastante tempo na execução e, demandam outro tempo considerável de análise para confirmar se foi um problema introduzido na mudança ou algum tipo de intermitência externa. Reduzir a quantidade deste tipo de teste, acredito ser uma das melhores soluções para minimizar a ocorrência de falhas inesperadas.

<aside>
⚠️ Reduzir não é remover! O processo de redução destes testes, normalmente, consiste em adaptar estes casos para utilização de *mocks* e em determinados casos, sua remoção, mas este, deveria ser feito apenas se outro teste já existente esteja cobrindo este caso específico.
</aside>

## Por que corrigir?

![Por que corrigir?](/images/posts/pexels-ann-h-12347774.jpg#floatleft)

Testes tem como função garantir que um comportamento desejado está de fato acontecendo, ou seja, se algo faz o que deveria fazer e, consequentemente, se uma alteração não impactou esse comportamento, gerando assim problemas que podem impactar diretamente os usuários desse sistema. Outro benefício que sistemas com boa cobertura de código traz, é para refatoração do código, pois, como temos os bons casos de testes, podemos facilmente identificar quando alguma modificação alterou o comportamento da aplicação, devendo assim ser reanalisada a alteração e em casos extremos, descartada.

Entendendo as vantagens citadas anteriormente, quando temos casos de testes que falham de maneira aleatória, independente de termos alterado algo ou não, acabamos perdendo essa confiança nos casos de testes, pois nunca temos certeza se criamos ou não um problema na aplicação com a mudança que fizemos, consequentemente consumindo um grande tempo de análise para confirmação de que o teste falhou devido à alteração ou algum teste considerado *Flaky*.

Testes consomem tempo de execução, quando nos deparamos com *Flaky Tests*, acabamos tendo que executar mais de uma vez os casos de testes para que estes finalizem com sucesso e isso, dependendo do caso, pode consumir grande parte do seu dia, principalmente quando usamos CI/CD que bloqueia a mesclagem de nosso código, quando este não executar com sucesso todos os casos de testes existentes, o que consequentemente, gera frustração ao desenvolvedor.

Nem sempre é fácil identificar esses casos, mas corrigi-los é importante para garantir a confiança nos casos de testes, trazer segurança em correções e no desenvolvimento de novas funcionalidades, além de melhorar a produtividade, visto que, passamos a ter garantia que, quando nossos testes falham, é de fato algum problema novo que criamos e não intermitência que, ao executar novamente, desaparece.