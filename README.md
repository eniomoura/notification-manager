# notification-manager

Uma aplicação servida via Web API utilizando NodeJS/TypeScript que permite o envio, atualização e consulta dos status de notificações via webhooks recebidos a partir de um serviço externo.

# Instalação:
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

# Endpoints

## POST /send - Enviar Notificação
```
{
  "channel": "sms" | "whatsapp",
  "to": "+5511999999999", //destinatário
  "body": "Hello World", //mensagem
}
```