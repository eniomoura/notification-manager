import { describe, it } from 'node:test';
import supertest, { Response } from 'supertest';

const api = supertest(`http://localhost:${process.env.PORT ?? 8000}`);
const uuid = crypto.randomUUID();

describe('POST /send', () => {
  it('should send a compliant notification', async () => {
    return api
      .post('/send')
      .send({
        channel: 'sms',
        to: '+5511999999999',
        body: 'Hello World',
        externalId: uuid,
      })
      .expect(201)
      .then((res: Response) => {
        console.log(res.body);
      })
      .catch((err: Error) => {
        console.error(err);
        throw err;
      });
  });
});

describe('PATCH /update', () => {
  it('should update the database based on webhook received', async () => {
    return api
      .patch('/update')
      .send({
        id: uuid,
        timestamp: new Date().toISOString(),
        event: 'delivered',
      })
      .expect(204)
      .then((res: Response) => {
        console.log(res.body);
      })
      .catch((err: Error) => {
        console.error(err);
        throw err;
      });
  });
});

describe('GET /query', () => {
  it('should query the database for a notification', async () => {
    return api
      .get('/query')
      .query({ externalId: uuid })
      .expect(200)
      .then((res: Response) => {
        console.log(res.body);
      })
      .catch((err: Error) => {
        console.error(err);
        throw err;
      });
  });
});
