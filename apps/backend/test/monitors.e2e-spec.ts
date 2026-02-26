import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('MonitorsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
      // Clean up after tests
      await prisma.heartbeat.deleteMany();
      await prisma.incident.deleteMany();
      await prisma.monitor.deleteMany();
      await app.close();
  });

  it('should create and list monitors', async () => {
    // Create
    const createRes = await request.default(app.getHttpServer())
      .post('/monitors')
      .send({
          name: 'E2E Test',
          url: 'http://example.com',
          type: 'HTTP',
          interval: 10
      })
      .expect(201);

    expect(createRes.body).toHaveProperty('name', 'E2E Test');

    // List
    const listRes = await request.default(app.getHttpServer())
       .get('/monitors')
       .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    // Since we just created one, it should be there.
    const found = listRes.body.find((m: any) => m.name === 'E2E Test');
    expect(found).toBeDefined();
  });

  it('should get monitor stats', async () => {
      const monitor = await prisma.monitor.create({
          data: {
              name: 'Stats Test',
              url: 'http://example.com',
              type: 'HTTP',
              interval: 10
          }
      });

      await prisma.heartbeat.create({
          data: {
              monitorId: monitor.id,
              status: 'UP',
              latency: 100
          }
      });

      const res = await request.default(app.getHttpServer())
        .get(`/monitors/${monitor.id}/stats`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      // Wait for it to be one, might be race condition if previous test failed cleanup?
      // Just check one of them has latency 100
      const found = res.body.find((h: any) => h.latency === 100);
      expect(found).toBeDefined();
  });
});
