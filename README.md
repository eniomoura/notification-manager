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
204 - Atualização realizada com sucesso.
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
