# notification-manager

Uma aplicação servida via Web API utilizando NodeJS/TypeScript que permite o envio, atualização e consulta dos status de notificações via webhooks recebidos a partir de um serviço externo.

# Instalação
* Clone o repositório e execute npm install
```bash
git clone https://github.com/eniomoura/notification-manager.git 
cd .\notification-manager\
npm install
```
* Para iniciar o ambiente de desenvolvimento, execute
```bash
npm run dev
```
* O banco de dados [`sqlite`](https://sqlite.org/) será criado automaticamente na primeira execução.

# Utilização - Endpoints
Os endpoints abaixo podem ser chamados via HTTP para efetuar as seguintes operações:

## POST /send - Enviar Notificação
### Corpo da requisição:
Todos os campos são obrigatórios.
```
id (número) - identificador interno da notificação
externalId (número) - identificador externo da notificação
channel (sms / whatsapp) - canal de envio
to (string) - destinatário
body - conteúdo da mensagem a ser enviada
```
Exemplo:
```
{
  "id": "1",
  "externalId": "321"
  "channel": "sms",
  "to": "123",
  "body": "Teste de notificacao",
}
```
Retorno:
```
201 - Notificação enviada com sucesso, retorna um objeto com os dados da notificação enviada
400 - O corpo da requisição está faltando algum campo obrigatório
500 - Erro no envio da notificação ou inserção no banco de dados interno, conciliação pode ser necessária
```

## PATCH /update - Atualizar Notificação
### Corpo da requisição:
Todos os campos são obrigatórios.
```
id (número) - identificador externo da notificação
timestamp (string de data em formato ISO) - data e hora da atualização
event (string) - novo estado da notificação
```
Exemplo:
```
{
  "id": "321",
  "timestamp": "2025-06-27T20:25:23.591Z",
  "event": "delivered"
}
```
Retorno:
```
204 - Atualização realizada com sucesso. Isso inclui no-ops.
202 - Atualização ignorada - o timestamp é mais antigo do que a última atualização.
400 - Corpo da requisição (webhook) não está no formato correto.
500 - Erro na atualização do status no banco de dados, conciliação pode ser necessária.
```

## GET /query - Atualizar Notificação
### Parâmetros de URL:
Todos os campos são obrigatórios.
```
externalId - identificador externo da notificação
```
Exemplo:
```
http://notificationmanager.api/query?externalId=321
```
Retorno:
```
200 - Pesquisa bem sucedida, retorna o objeto da notificação com o id fornecido.
204 - Pesquisa bem sucedida, porém nenhum resultado foi encontrado.
400 - Corpo da requisição (webhook) não está no formato correto.
500 - Erro na atualização do status no banco de dados, conciliação pode ser necessária.
```

# Testes
Testes de integração são incluídos no pacote. Para executá-los, execute no terminal:
```bash
npm run test
```

# Perguntas
> Caso a nossa aplicação fique indisponível por muito tempo, podemos perder eventos de mudança de status. Quais medidas você tomaria para deixar a aplicação mais robusta?

A aplicação poderia ser modificada para poder ser executada em várias instâncias, que poderiam ser containerizadas e hospedadas em diferentes lugares.

Outra possível medida seria a implementação de uma fila de eventos a serem realizados via um broker de mensageria como o RabbitMQ, servindo como um buffer para atualizações pendentes.

A aplicação também implementa o armazenamento de webhooks recebidos que não tiveram uma atualização realizada, servindo como uma fila para uma reconciliação de dados após uma indisponibilidade do banco de dados, que foi uma medida tomada pensando nessa possibiliddade.

> Precisamos enviar os eventos de mudança de status das notificações para um stream de eventos (e.g. Apache Kafka, Amazon Kinesis Data Streams, etc) para que outras aplicações possam consumí-los. Precisamos garantir que cada evento seja entregue pelo menos uma vez no stream. Como você faria esse processo?

O armazenamento de webhooks feito pela aplicação consegue manter um registro de quais eventos foram recebidos e quais ainda precisam ser processados. É possível implementar um método de reconciliação, que executa os eventos pendentes.

Para garantir que os eventos sejam sempre  entregues, se houver falha na retentativa, podem ser realizadas novas tentativas, até que cada transição do canal daquela notificação seja enviada.

> Os eventos de mudança de estado podem vir eventualmente fora de ordem, caso o serviço externo de notificações demore para processar. Como você lidaria com isso?

A aplicação ignora webhooks com timestamps mais antigos, mantendo o estado da notificação condizente apenas com o webhook mais recente. A criação da notificação em si é realizada pelo próprio cliente e registrada no banco ao ser enviada, portanto sempre terá o webhook mais antigo.

A aplicação poderia validar as transições para cada canal, mas decidi que como o propósito da aplicação é manter um registro que espelharia o estado da notificação no servidor, considerei os webhooks confiáveis para a manutenção de estados válidos. Essa validação ainda poderia ser útil para uma reconciliação dos estados caso a aplicação fique indisponível.
