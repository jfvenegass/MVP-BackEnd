import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

interface LoginResponse {
  accessToken: string;
}

interface CreateTorneoResponse {
  id: string;
}

describe('Torneos (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'usuario1@uninorte.edu.com',
        password: '12345678Aa!',
      });

    const loginBody = loginRes.body as LoginResponse;
    token = loginBody.accessToken;
  });

  it('POST /torneos debe crear torneo', async () => {
    const res = await request(app.getHttpServer())
      .post('/torneos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Torneo Test',
        descripcion: 'Test e2e',
        esPublico: true,
        tipo: 'PUNTOS',
        recurrencia: 'NINGUNA',
        fechaInicio: '2026-03-01T00:00:00Z',
        fechaFin: '2026-03-31T23:59:59Z',
      });

    expect(res.status).toBe(201);

    const body = res.body as CreateTorneoResponse;
    expect(body.id).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
