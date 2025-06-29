import sqlite3 from 'sqlite3';
import { Channel, type Notification } from '../services/notificationSdk';
const db = new sqlite3.Database(':memory:');

export function initDB() {
  process.on('exit', () => {
    db.close();
  });

  db.serialize(() => {
    db.run(
      'CREATE TABLE notifications (' +
        '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '`externalId` TEXT,' +
        '`channel` TEXT,' +
        '`to` TEXT,' +
        '`body` TEXT,' +
        '`status` TEXT' +
        ')',
    );
  });
}

export function insertNotification(
  channel: Channel,
  to: string,
  body: string,
  externalId: string,
  status: string = 'processing',
) {
  db.serialize(() => {
    db.prepare('INSERT INTO notifications VALUES (null, ?, ?, ?, ?, ?)')
      .run(externalId, channel, to, body, status)
      .finalize();
    dumpNotifications();
  });
}

export function updateNotificationStatus(externalId: number, status: string) {
  db.serialize(() => {
    db.prepare('UPDATE notifications SET status = ? WHERE externalId = ?')
      .run(status, externalId)
      .finalize();
    dumpNotifications();
  });
}

export function queryNotification(externalId: number): Promise<Notification> {
  return new Promise<Notification>((resolve) =>
    db.serialize(() => {
      db.prepare('SELECT status FROM notifications WHERE externalId = ?')
        .run(externalId)
        .get(resolve || console.log)
        .finalize();
    }),
  );
}

//DEBUG FUNCTION
export function dumpNotifications() {
  console.clear();
  db.all('SELECT * FROM notifications', console.log);
}
