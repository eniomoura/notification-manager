import express, { Request, Response } from 'express';
import { NotificationSdk } from '../services/notificationSdk';
import type { Notification } from '../services/notificationSdk';
const router = express.Router();

const notificationSdk = new NotificationSdk();

router.post('/send', async (req: Request, res: Response) => {
  const { channel, to, body, externalId } = req.body as Notification;
  console.log(new Date().toLocaleString().concat(':'), req.body);
  if (!channel || !to || !body || !externalId) {
    res.status(400).send();
    return;
  }
  const response = await notificationSdk.send(channel, to, body, externalId);
  res.status(200).send(response);
});

router.post('/update', (req: Request, res: Response) => {
  // update notification status on DB from webhook body
  console.log(new Date().toLocaleString().concat(':'), res.statusCode);
});

router.get('/query', (req: Request, res: Response) => {
  // query notification status from db
  console.log(new Date().toLocaleString().concat(':'), res.statusCode);
});

export default router;
