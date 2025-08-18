import request from 'supertest';
import { INestApplication } from '@nestjs/common';

export async function userToken(app: INestApplication) {
  const dto = { email: 'squad@email.com', password: 'StrongPassword1!' };

  await request(app.getHttpServer()).post('/auth/signup').send(dto);

  const res = await request(app.getHttpServer())
    .post('/auth/signin')
    .send(dto)
    .expect(200);

  return res.body.access_token as string;
}