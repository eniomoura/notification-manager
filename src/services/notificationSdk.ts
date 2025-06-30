import {
  insertNotification,
  queryNotification,
  updateNotificationStatus,
} from './database';

export enum Channel {
  sms = 'sms',
  whatsApp = 'whatsApp',
}

export interface Webhook {
  // id definido pelos sistemas externos ao serviço de notificações
  id: number;

  // data/hora de envio da notificação
  timestamp: string;

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

  //status da notificação
  status: string;

  // other fields: recipients, timestamps, etc
  timestamp?: string;
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
    insertNotification(channel, to, body, externalId, new Date().toISOString());
    return new Promise<Notification>((resolve) => {
      const id = (Math.random() + 1).toString(36).substring(7);
      resolve({ id, channel, to, body, externalId, status: 'processing' });
    });
  }

  // updates a notification in the internal db
  async update(webhook: Webhook): Promise<void> {
    //store webhook for later reconciliation
    //check if notification exists in internal db
    //check if the webhook timestamp is newer than the db one
    //update notification if the webhook timestamp is newer than the db one
    //return updated notification
    updateNotificationStatus(webhook);
  }

  // returns a notification from the internal db
  query(externalId: string): Promise<Notification> {
    return queryNotification(Number.parseInt(externalId));
  }
}
