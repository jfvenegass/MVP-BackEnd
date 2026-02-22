import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Torneos (e2e real)', () => {
  let app: INestApplication;
  let torneoId: string;

  const authToken = 'TU_TOKEN_REAL_AQUI';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Crear torneo real', async () => {
    const res = await request(app.getHttpServer())
      .post('/torneos')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nombre: `TEST_Torneo_${Date.now()}`,
        descripcion: 'Torneo testing real',
        esPublico: true,
        tipo: 'RANKING',
        fechaInicio: new Date().toISOString(),
        fechaFin: new Date(Date.now() + 86400000).toISOString(),
        recurrencia: 'NINGUNA',
      })
      .expect(201);

    torneoId = res.body._id;
    expect(res.body._id).toBeDefined();
  });

  it('Obtener torneo real', async () => {
    const res = await request(app.getHttpServer())
      .get(`/torneos/${torneoId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body._id).toBe(torneoId);
  });

  afterAll(async () => {
    await app.close();
  });
});