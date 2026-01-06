import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { userToken } from '../../test/utils/utils';
import { populateSquad } from '../../test/utils/seedHelpers/squad';

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

    await populateSquad(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /squad', () => {
    it('should be rejected without jwt', async () => {
      await request(app.getHttpServer()).get('/squad').expect(401);
    });

    it('should grab full squad list', async () => {
      const result = await request(app.getHttpServer())
        .get('/squad')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should be able to filter through the squad list', async () => {
      const result = await request(app.getHttpServer())
        .get('/squad')
        .query({ position: 'Forward', nationality: 'Australia' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(result.body[0].name).toBe('Nesteroy Irankunda');
    });
  });

  describe.skip('GET /squad/api', () => {
    it('should do something', async () => {
      const result = await request(app.getHttpServer())
        .get('/squad/api')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  })
});