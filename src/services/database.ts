import sqlite3 from 'sqlite3';
import { readFileSync } from 'node:fs';
import { Channel, Webhook } from '../services/notificationSdk';

const db = new sqlite3.Database('database.db');
const schema = readFileSync('schema.sql', 'utf8');

export function initDB(): Promise<void> {
  process.on('exit', () => {
    db.close();
  });

  return new Promise<void>((resolve, reject) =>
    db.serialize(() => {
      db.run(schema, (err: Error) => {
        if (err) reject(err);
        else resolve();
      });
    }),
  );
}

export function insertNotification(
  channel: Channel,
  to: string,
  body: string,
  externalId: string,
  timestamp: string,
  status: string = 'processing',
): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    db.serialize(() => {
      db.prepare('INSERT INTO notifications VALUES (null, ?, ?, ?, ?, ?, ?)')
        .run(externalId, channel, to, body, status, timestamp, (err: Error) => {
          if (err) reject(err);
          resolve();
        })
        .finalize();
    }),
  );
}

export function insertWebhook(webhook: Webhook) {
  return new Promise<void>((resolve, reject) =>
    db.serialize(() => {
      db.prepare('INSERT INTO webhooks VALUES (null, ?, ?, ?)')
        .run(webhook.id, webhook.event, webhook.timestamp, (err: Error) => {
          if (err) reject(err);
          resolve();
        })
        .finalize();
    }),
  );
}

export function updateNotificationStatus(webhook: Webhook): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    db.serialize(() => {
      db.prepare('UPDATE notifications SET status = ? WHERE externalId = ?')
        .run(webhook.event, webhook.id, (err: Error) => {
          if (err) reject(err);
          resolve();
        })
        .finalize();
    }),
  );
}

export function queryNotification(externalId: number): Promise<Notification> {
  return new Promise<Notification>((resolve, reject) =>
    db.serialize(() => {
      db.prepare('SELECT * FROM notifications WHERE externalId = ?')
        .get(externalId, (err: Error, response: Notification) => {
          if (err) reject(err);
          resolve(response);
        })
        .finalize();
    }),
  );
}
