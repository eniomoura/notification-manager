import sqlite3 from 'sqlite3';
import { readFileSync } from 'node:fs';
import { Channel } from '../services/notificationSdk';

export interface Webhook {
  id: number;
  event: string;
  timestamp: string;
  processed?: boolean;
}

const schema = readFileSync('schema.sql', 'utf8');
const db = new sqlite3.Database('database.db');

function execDB(
  callback: (resolve: () => void, reject: (err: Error) => void) => void,
): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    db.serialize(() => callback(resolve, reject)),
  );
}

export function initDB(): Promise<void> {
  process.on('exit', () => {
    db.close();
  });

  return execDB((resolve, reject) => {
    db.exec(schema, (err) => (err ? reject(err) : resolve()));
  });
}

export function insertNotification(
  channel: Channel,
  to: string,
  body: string,
  externalId: string,
  timestamp: string,
  status: string = 'processing',
): Promise<void> {
  return execDB((resolve, reject) => {
    db.prepare('INSERT INTO notifications VALUES (null, ?, ?, ?, ?, ?, ?)')
      .run(externalId, channel, to, body, status, timestamp, (err: Error) =>
        err ? reject(err) : resolve(),
      )
      .finalize();
  });
}

export function insertWebhook(webhook: Webhook): Promise<void> {
  return execDB((resolve, reject) => {
    db.prepare('INSERT INTO webhooks VALUES (?, ?, ?, ?)')
      .run(
        webhook.id,
        webhook.event,
        webhook.timestamp,
        webhook.processed || 0,
        (err: Error) => (err ? reject(err) : resolve()),
      )
      .finalize();
  });
}

export function updateNotificationStatus(webhook: Webhook): Promise<void> {
  return execDB((resolve, reject) => {
    db.prepare('UPDATE notifications SET status = ? WHERE externalId = ?')
      .run(webhook.event, webhook.id, (err: Error) =>
        err ? reject(err) : resolve(),
      )
      .finalize();
  });
}

export function queryNotification(externalId: number): Promise<Notification> {
  return new Promise<Notification>((resolve, reject) =>
    db.serialize(() => {
      db.prepare('SELECT * FROM notifications WHERE externalId = ?')
        .get(externalId, (err: Error, response: Notification) =>
          err ? reject(err) : resolve(response),
        )
        .finalize();
    }),
  );
}
