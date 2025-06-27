import { NotificationSdk } from '../services/notificationSdk';
import express, { Request, Response } from 'express';
import type { Notification, Webhook } from '../services/notificationSdk';
const router = express.Router();

const notificationSdk = new NotificationSdk();

// Send a notification to the external server, returns the notification object with the id
router.post('/send', async (req: Request, res: Response) => {
  console.log(new Date().toLocaleString().concat(' POST /send:'), req.body);
  const { channel, to, body, externalId } = req.body as Notification;
  if (!channel || !to || !body || !externalId) {
    res.status(400).send();
    return;
  }
  const response = await notificationSdk.send(channel, to, body, externalId);
  res.status(200).send(response);
});

// Update notification status on DB from webhook body
router.post('/update', async (req: Request, res: Response) => {
  console.log(new Date().toLocaleString().concat(' POST /update:'), req.body);
  const { id, timestamp, event } = req.body as Webhook;
  if (!id || !timestamp || !event) {
    res.status(400).send();
    return;
  }
  const response = await notificationSdk.update({ id, timestamp, event });
  res.status(204).send(response);
});

// Query notification status from DB
router.get('/query', (req: Request, res: Response) => {
  console.log(new Date().toLocaleString().concat(' GET /query:'), req.body);
  res.status(204).send();
});

export default router;
