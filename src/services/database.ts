import sqlite3 from 'sqlite3';
import { readFileSync } from 'node:fs';
import { Channel } from '../services/notificationSdk';

export interface Webhook {
  notificationId: string;
  event: string;
  timestamp: string;
  processed?: boolean;
}

const schema = readFileSync('schema.sql', 'utf8');
const db = new sqlite3.Database('database.db');

// Wrapper para executar comandos síncronos no banco de dados
function execDB(
  callback: (resolve: () => void, reject: (err: Error) => void) => void,
): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    db.serialize(() => callback(resolve, reject)),
  );
}

// Inicializa o banco de dados com o schema
export function initDB(): Promise<void> {
  process.on('exit', () => {
    db.close();
  });

  return execDB((resolve, reject) => {
    db.exec(schema, (err) => (err ? reject(err) : resolve()));
  });
}

// Insere uma notificação no banco de dados
export function insertNotification(
  channel: Channel,
  to: string,
  body: string,
  externalId: string,
  timestamp: string,
  status: string = 'processing',
): Promise<void> {
  return execDB((resolve, reject) => {
    //COLUNAS: id, externalId, channel, to, body, status, timestamp
    db.prepare('INSERT INTO notifications VALUES (null, ?, ?, ?, ?, ?, ?)')
      .run(externalId, channel, to, body, status, timestamp, (err: Error) =>
        err ? reject(err) : resolve(),
      )
      .finalize();
  });
}

// Insere um webhook no banco de dados para manter um registro
export function insertWebhook(webhook: Webhook): Promise<void> {
  return execDB((resolve, reject) => {
    //COLUNAS: externalId, event, timestamp, processed
    db.prepare('INSERT INTO webhooks VALUES (null, ?, ?, ?, ?)')
      .run(
        webhook.notificationId,
        webhook.event,
        webhook.timestamp,
        false,
        (err: Error) => (err ? reject(err) : resolve()),
      )
      .finalize();
  });
}

// Atualiza o status de uma notificação no banco de dados caso o timestamp do webhook
// seja mais recente, e marca o webhook como processado caso exista
export function updateNotificationStatus(webhook: Webhook): Promise<void> {
  return execDB((resolve, reject) => {
    db.run('BEGIN TRANSACTION');
    db.prepare(
      'UPDATE notifications SET status = ? WHERE externalId = ? AND timestamp < ?',
    )
      .run(
        webhook.event,
        webhook.notificationId,
        webhook.timestamp,
        (err: Error) => {
          if (err) {
            db.run('ROLLBACK');
            return reject(err);
          }
        },
      )
      .finalize();

    queryNotification(webhook.notificationId).then((notification) => {
      if (notification) {
        db.prepare(
          'UPDATE webhooks SET processed = 1 WHERE notificationId = ? AND event = ?',
        )
          .run(webhook.notificationId, webhook.event, (err: Error) => {
            if (err) {
              db.run('ROLLBACK');
              return reject(err);
            }
          })
          .finalize(() => {
            db.run('COMMIT', (err: Error) => {
              if (err) {
                db.run('ROLLBACK');
                return reject(err);
              }
              resolve();
            });
          });
      } else {
        console.warn(
          `Webhook se refere a uma notificação desconhecida ${webhook.notificationId}.\n` +
            'Isso pode ser devido a um problema ao armazenar notificações no banco de dados.\n' +
            'O webhook será armazenado e precisará ser reprocessado.',
        );
        // Pode ser feita aqui uma lógica de reprocessamento automática
        db.run('COMMIT', (err: Error) => {
          if (err) {
            db.run('ROLLBACK');
            return reject(err);
          }
          resolve();
        });
      }
    });
  });
}

// Busca uma notificação no banco de dados e retorna toda sua informação
export function queryNotification(externalId: string): Promise<Notification> {
  return new Promise<Notification>((resolve, reject) =>
    db
      .prepare('SELECT * FROM notifications WHERE externalId = ?')
      .get(externalId, (err: Error, response: Notification) =>
        err ? reject(err) : resolve(response),
      )
      .finalize(),
  );
}
