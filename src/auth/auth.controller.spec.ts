import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from'argon2';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  })

  afterAll(async () => {
    await app?.close();
  });

  describe('/signup', () => {
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

    it('should fail if provided password is too weak', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'test@email.com', password: 'weakpassword' })
        .expect(400, /password is too weak/);
    });

    it('should reject duplicate emails', async () => {
      const dto = { email: 'test@email.com', password: 'StrongPassword1!' };

      // First sign-up attempt
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(201);

      // Second sign-up attempt with same email
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(500, /Internal server error/); // or custom error if you're handling P2002
    });

    it.only('should complete a successful sign-up', async () => {

      const dto = { email: 'test@email.com', password: 'StrongPassword1!' };

      const result = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(201);

      expect(result.body).toEqual({
        message: 'User signed up successfully',
        user: dto.email,
      });
    });
  })

  describe('signin', () => {
    it('should fail if provided invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: 'invalid', password: 'StrongPassword1!' })
        .expect(400, /email must be an email/);
    });

      it('should fail if provided password less than eight characters', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: 'test@email.com', password: 'abc' })
        .expect(400, /password must be longer than or equal to 8 characters/);
    });

    it('should fail if provided password is too weak', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: 'test@email.com', password: 'weakpassword' })
        .expect(400, /password is too weak/);
    });

    it('should reject non-existent credentials', async () => {
      const dto = { email: 'test@email.com', password: 'StrongPassword1!' };
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send(dto)
        .expect(401, /Unauthorized/);
    });

    it('should reject if user exists but wrong password', async () => {
      await prisma.user.create({
        data: {
          email: 'test@email.com',
          password: await argon2.hash('StrongPassword1!'),
        },
      });
      const dto = { email: 'test@email.com', password: 'WrongPassword1!' };
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send(dto)
        .expect(401, /Unauthorized/);
    });

    it('should accept correct credentials', async () => {
      await prisma.user.create({
        data: {
          email: 'test@email.com',
          password: await argon2.hash('StrongPassword1!'),
        },
      });
      const dto = { email: 'test@email.com', password: 'StrongPassword1!' };
      const result = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(dto)
        .expect(200);
      expect(result.body).toHaveProperty('access_token');
    });
  })
});
