import { describe, it } from 'node:test';
import supertest, { Response } from 'supertest';

const api = supertest(`http://localhost:${process.env.PORT ?? 8000}`);

describe('POST /send', () => {
  it('should send a compliant notification', () => {
    api
      .post('/send')
      .send({
        channel: 'sms',
        to: '+5511999999999',
        body: 'Hello World',
        externalId: '1234',
      })
      .expect(200)
      .end((err: Error, res: Response) => {
        if (err) throw err;
        console.log(res.body);
      });
  });
});
