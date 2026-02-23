import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { RankingItem } from './types';

describe('Torneos - Ranking con desempate (e2e)', () => {
  let app: INestApplication;
  let tokenA: string;
  let tokenB: string;
  let torneoId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginA = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'usuarioprueba1@uninorte.edu.co',
        password: '12345678Aa!',
      });

    tokenA = (loginA.body as { accessToken: string }).accessToken;

    const loginB = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'usuarioprueba2@uninorte.edu.co',
        password: '12345678Bb!',
      });

    tokenB = (loginB.body as { accessToken: string }).accessToken;

    const torneoRes = await request(app.getHttpServer())
      .post('/api/v1/torneos')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        nombre: 'Torneo Ranking Test',
        descripcion: 'Test',
        esPublico: true,
        tipo: 'PUNTOS',
        fechaInicio: new Date(Date.now() - 1000),
        fechaFin: new Date(Date.now() + 1000000),
        recurrencia: 'NINGUNA',
      });

    torneoId = (torneoRes.body as { id: string }).id;
  });

  it('Debe ordenar por puntaje DESC y tiempo ASC', async () => {
    await request(app.getHttpServer())
      .post(`/api/v1/torneos/${torneoId}/unirse`)
      .set('Authorization', `Bearer ${tokenA}`);

    await request(app.getHttpServer())
      .post(`/api/v1/torneos/${torneoId}/unirse`)
      .set('Authorization', `Bearer ${tokenB}`);

    await request(app.getHttpServer())
      .post(`/api/v1/torneos/${torneoId}/resultados`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ puntaje: 100, tiempo: 50 });

    await request(app.getHttpServer())
      .post(`/api/v1/torneos/${torneoId}/resultados`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ puntaje: 100, tiempo: 40 });

    const res = await request(app.getHttpServer())
      .get(`/api/v1/torneos/${torneoId}/ranking`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    const ranking = res.body as RankingItem[];
    expect(ranking[0].tiempo).toBe(40);
  });

  afterAll(async () => {
    await app.close();
  });
});
