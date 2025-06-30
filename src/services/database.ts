import sqlite3 from 'sqlite3';
import {
  Channel,
  Webhook,
  type Notification,
} from '../services/notificationSdk';
const db = new sqlite3.Database('database.db');

export function initDB() {
  process.on('exit', () => {
    db.close();
  });

  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS notifications (' +
        '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '`externalId` TEXT,' +
        '`channel` TEXT,' +
        '`to` TEXT,' +
        '`body` TEXT,' +
        '`status` TEXT' +
        '`timestamp` TEXT' +
        ')',
    );
  });
}

export function insertNotification(
  channel: Channel,
  to: string,
  body: string,
  externalId: string,
  timestamp: string,
  status: string = 'processing',
) {
  db.serialize(() => {
    db.prepare('INSERT INTO notifications VALUES (null, ?, ?, ?, ?, ?, ?)')
      .run(externalId, channel, to, body, status, timestamp)
      .finalize();
  });
}

export function updateNotificationStatus(webhook: Webhook) {
  db.serialize(() => {
    db.prepare('UPDATE notifications SET status = ? WHERE externalId = ?')
      .run(webhook.event, webhook.id)
      .finalize();
  });
}

export function queryNotification(externalId: number): Promise<Notification> {
  return new Promise<Notification>((resolve) =>
    db.serialize(() => {
      db.prepare('SELECT * FROM notifications WHERE externalId = ?')
        .get(externalId, (err: Error, response: Notification) => {
          if (err) throw err;
          resolve(response);
        })
        .finalize();
    }),
  );
}
