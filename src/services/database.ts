import sqlite3 from 'sqlite3';
import type { Notification } from '../services/notificationSdk';
const db = new sqlite3.Database(':memory:');

function initDB() {
  db.serialize(() => {
    db.run(
      'CREATE TABLE notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, externalId TEXT, channel TEXT, to TEXT, body TEXT, status TEXT) ',
    );
  });
}

function insertNotification(
  notification: Notification,
  status: string = 'processing',
) {
  db.serialize(() => {
    const stmt = db.prepare(
      'INSERT INTO notifications VALUES (null, ?, ?, ?, ?)',
    );
    stmt.run(
      notification.externalId,
      notification.channel,
      notification.to,
      notification.body,
      status,
    );
    stmt.finalize();
  });
}

function updateNotificationStatus(externalId: number, status: string) {
  db.serialize(() => {
    const stmt = db.prepare(
      'UPDATE notifications SET status = ? WHERE externalId = ?',
    );
    stmt.run(status, externalId);
    stmt.finalize();
  });
}

//finish this, the idea is to get either
function queryNotificationStatus(externalId: number, id: number) {
  db.serialize(() => {
    const stmt = db.prepare(
      'SELECT status FROM notifications WHERE externalId = ?',
    );
    stmt.run(externalId);
    stmt.finalize();
  });
}

process.on('exit', () => {
  db.close();
});
