import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const prismaMock = {
      user: { create: jest.fn(), findUnique: jest.fn() },
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('should fail if provided invalid email', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'invalid', password: 'password' })
      .expect(400);
  });
  it('should fail if provided password less than eight characters', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@email.com', password: 'abc' })
      .expect(400, /password must be longer than or equal to 8 characters/);
  });
  it('should fail if provided password less than eight characters', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@email.com', password: 'abc' })
      .expect(400, /password must be longer than or equal to 8 characters/);
  });

  afterAll(async () => {
    await app?.close();
  });
});
