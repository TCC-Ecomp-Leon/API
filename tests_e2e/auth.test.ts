import request from 'supertest';
import app from '../src/app';

const endpoint = '/auth/sign/';

test('', async () => {
  const result = await request(app).post(endpoint);

  console.log(result.statusCode);
  console.log(result.body);
});
