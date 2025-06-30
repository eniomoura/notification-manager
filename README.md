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
Corpo da requisição:
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

## PATCH /update - Atualizar Notificação
Corpo da requisição:
```
id (número) - identificador externo da notificação
timestamp (data em formato ISO) - data e hora da atualização
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

## GET /query - Atualizar Notificação
Parâmetros de URL:
```
externalId - identificador externo da notificação
```
Exemplo:
```
http://notificationmanager.api/query?externalId=321
```