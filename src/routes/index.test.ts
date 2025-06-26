import type { Response } from 'express';
const request = require('supertest');

const api = request(`http://localhost:${process.env.PORT ?? 8000}`);

api
  .post('/send')
  .expect(200)
  .end(function (res: Response) {
    console.log('Test /send: Status', res.statusCode, '(success)');
  });
