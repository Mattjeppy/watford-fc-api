import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

// look into using a mock sqlite database

describe('AuthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const users: any[] = [];
    const prismaMock = {
  user: {
    create: jest.fn(async ({ data }) => {
      if (users.find(u => u.email === data.email)) {
        const error: any = new Error('Unique constraint failed');
        error.code = 'P2002'; // Prisma unique constraint code
        throw error;
      }
      users.push(data);
      return data;
    }),
    findUnique: jest.fn(({ where }) => users.find(u => u.email === where.email)),
  },
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
      .send({ email: 'invalid', password: 'StrongPassword1!' })
      .expect(400, /email must be an email/);
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
  it('should fail if provided password is too weak', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@email.com', password: 'weakpassword' })
      .expect(400, /password is too weak/);
  });
  it('should reject duplicate emails', async () => {
    const dto = { email: 'test@email.com', password: 'StrongPassword1!' }
    // first sign-up attempt
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(dto)
      .expect(201);
    // second sign-up attempt (same credentials)
    await request(app.getHttpServer())
    .post('/auth/signup')
    .send(dto)
    .expect(500, /Internal server error/);
  });

  afterAll(async () => {
    await app?.close();
  });
});
