enum Channel {
  sms = 'sms',
  whatsApp = 'whatsApp',
}

export interface Webhook {
  // id definido pelos sistemas externos ao serviço de notificações
  id: number;

  // data/hora de envio da notificação
  timestamp: number;

  // transição da notificação que ocorreu
  event: string;
}

export interface Notification {
  // id da notificação no disparador
  id: string;

  // canal da notificação
  channel: Channel;

  // id do destinatário ex: +5511999999999
  to: string;

  // conteúdo da notificação
  body: string;

  // id definido pelos sistemas externos ao serviço de notificações
  externalId: string;

  // other fields: recipients, timestamps, etc
}

export class NotificationSdk {
  // checks if a notification with the given externalId exists
  exists(externalId: string): Promise<boolean> {
    // mocked value, could return false
    return new Promise<boolean>((resolve) => resolve(true));
  }

  // sends a notification
  send(
    channel: Channel,
    to: string,
    body: string,
    externalId: string,
  ): Promise<Notification> {
    // mocked charge
    return new Promise<Notification>((resolve) => {
      const id = (Math.random() + 1).toString(36).substring(7);
      resolve({ id, channel, to, body, externalId });
    });
  }

  // updates a notification in the internal db
  update(webhook: Webhook): Promise<void> {
    //if notification doesn't exist in the db, create it

    //if it does, update it if the webhook timestamp is newer than the db one

    // mocked update
    return new Promise<void>((resolve) => resolve());
  }
}
