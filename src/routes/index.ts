import express, { Request, Response } from 'express';
const router = express.Router();

router.post('/send', (req: Request, res: Response) => {
  // send notification to external service
  console.log(Date.now(), req.body);
  res.status(200).send();
});

router.post('/update', (req: Request, res: Response) => {
  // update notification status on DB from webhook body
  console.log(Date.now(), req.body);
});

router.get('/query', (req: Request, res: Response) => {
  // query notification status from db
  console.log(Date.now(), req.body);
});

export default router;
