import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('Torneos - Resultado sin participación (e2e)', () => {
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
        nombre: 'Torneo Resultado Test',
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

  it('No debe permitir enviar resultado sin unirse', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/torneos/${torneoId}/resultados`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        puntaje: 100,
        tiempo: 60,
      });

    expect(res.status).toBe(403);
  });

  afterAll(async () => {
    await app.close();
  });
});
