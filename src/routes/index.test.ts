import { describe, it } from 'node:test';
import supertest, { Response } from 'supertest';

const api = supertest(`http://localhost:${process.env.PORT ?? 8000}`);

describe('POST /send', () => {
  it('should send a compliant notification', async () => {
    await api
      .post('/send')
      .send({
        channel: 'sms',
        to: '+5511999999999',
        body: 'Hello World',
        externalId: '1234',
      })
      .expect(200)
      .then((res: Response) => {
        console.log(res.body);
      })
      .catch((err: Error) => {
        throw err;
      });
  });
});

describe('POST /update', () => {
  it('should update the database based on webhook received', async () => {
    await api
      .post('/update')
      .send({
        timestamp: 'YYYY-MM-DDThh:mm:ss.SSSZ',
        event: 'delivered', // or sent, etc
      })
      .expect(200)
      .then((res: Response) => {
        console.log(res.body);
      })
      .catch((err: Error) => {
        throw err;
      });
  });
});
