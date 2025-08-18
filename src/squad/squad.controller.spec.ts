import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { userToken } from '../../test/utils/utils';

describe('SquadController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    token = await userToken(app);
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  })

  afterAll(async () => {
    await app?.close();
  });

  describe('GET /squad', () => {
    it.only('should be rejected access without jwt', async () => {
      await request(app.getHttpServer()).get('/squad').expect(401);
    });
    it.only('should be rejected access without jwt', async () => {
      console.debug(token);
      await request(app.getHttpServer())
        .get('/squad')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    });
  });

});