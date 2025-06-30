import express, { Request, Response } from 'express';
import { NotificationSdk } from '../services/notificationSdk';
import type { Notification, Webhook } from '../services/notificationSdk';
import {
  queryNotification,
  updateNotificationStatus,
} from '../services/database';
const router = express.Router();

const notificationSdk = new NotificationSdk();

// Send a notification to the external server, returns the notification object with the id
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

// Update notification status on DB from webhook body
router.patch('/update', (req: Request, res: Response) => {
  const { id, timestamp, event } = req.body as Webhook;
  console.log(new Date().toLocaleString().concat(' POST /update:'), req.body);
  if (!id || !timestamp || !event) {
    res.status(400).send();
    return;
  }
  //TODO: store webhook for later reconciliation
  //TODO: check if notification exists in internal db - if it doesn't, maybe trigger reconciliation?
  //TODO: check if the webhook timestamp is newer than the db one - ignore update if older
  updateNotificationStatus({ id, timestamp, event })
    .then(() => res.status(204).send())
    .catch((err: Error) => {
      console.error(err);
      res.status(500).send(err);
    });
});

// Query notification status from DB
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
  queryNotification(Number.parseInt(externalId))
    .then((response) => {
      if (response) {
        res.status(200).send(response);
      } else {
        res.status(204).send(response);
      }
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).send(err);
    });
});

export default router;
