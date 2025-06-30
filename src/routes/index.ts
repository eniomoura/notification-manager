import express, { Request, Response } from 'express';
import { NotificationSdk, Notification } from '../services/notificationSdk';
import {
  insertWebhook,
  queryNotification,
  updateNotificationStatus,
  Webhook,
} from '../services/database';

const router = express.Router();
const notificationSdk = new NotificationSdk();

// Manda uma notificação para o servidor externo, retorna o objeto da notificação com o id
router.post('/send', (req: Request, res: Response) => {
  const { channel, to, body, externalId } = req.body as Notification;
  console.log(new Date().toLocaleString().concat(' POST /send:'), req.body);
  if (!channel || !to || !body || !externalId) {
    res.status(400).send();
    return;
  }
  notificationSdk
    .send(channel, to, body, externalId)
    .then((response) => res.status(201).send(response))
    .catch((err: Error) => {
      console.error(err);
      res.status(500).send(err);
    });
});

// Recebe um webhook e atualiza o status da notificação no banco de dados
router.patch('/update', async (req: Request, res: Response) => {
  const { id, timestamp, event } = req.body as {
    id: string;
    timestamp: string;
    event: string;
  };
  console.log(new Date().toLocaleString().concat(' POST /update:'), req.body);
  if (!id || !timestamp || !event) {
    res.status(400).send();
    return;
  }
  try {
    await Promise.all([
      insertWebhook({ notificationId: id, timestamp, event }),
      updateNotificationStatus({ notificationId: id, timestamp, event }),
    ]);
    res.status(204).send();
  } catch (err: unknown) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Consulta uma notificação no banco de dados e retorna toda sua informação
router.get('/query', (req: Request, res: Response) => {
  const { externalId } = req.query as { externalId: string };
  console.log(
    new Date().toLocaleString().concat(' GET /query:'),
    req.query.externalId,
  );
  if (!externalId) {
    res.status(400).send();
    return;
  }
  queryNotification(externalId)
    .then((response) => {
      if (response) {
        return res.status(200).send(response);
      }
      res.status(204).send();
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).send(err);
    });
});

export default router;
