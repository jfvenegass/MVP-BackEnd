import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('Torneos - Unión duplicada (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let torneoId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'usuarioprueba1@uninorte.edu.co',
        password: '12345678Aa!',
      });

    const body = loginRes.body as { accessToken: string };
    accessToken = body.accessToken;

    const torneoRes = await request(app.getHttpServer())
      .post('/api/v1/torneos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        nombre: 'Torneo Union Test',
        descripcion: 'Test',
        esPublico: true,
        tipo: 'PUNTOS',
        fechaInicio: new Date(Date.now() - 1000),
        fechaFin: new Date(Date.now() + 1000000),
        recurrencia: 'NINGUNA',
      });

    const torneoBody = torneoRes.body as { id: string };
    torneoId = torneoBody.id;
  });

  it('no debe permitir unirse dos veces', async () => {
    await request(app.getHttpServer())
      .post(`/api/v1/torneos/${torneoId}/unirse`)
      .set('Authorization', `Bearer ${accessToken}`);

    const res = await request(app.getHttpServer())
      .post(`/api/v1/torneos/${torneoId}/unirse`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
