import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { CreateTorneoResponse, LoginResponse, TorneoResponse } from './types';

describe('Estado automático del torneo (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'usuario123@uninorte.edu.com',
        password: '12345678Ll!',
      });

    const loginBody = loginRes.body as LoginResponse;
    accessToken = loginBody.accessToken;
  });

  it('debe cambiar automáticamente a FINALIZADO', async () => {
    const torneoRes = await request(app.getHttpServer())
      .post('/api/v1/torneos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        nombre: 'Torneo Pasado',
        descripcion: 'Test',
        esPublico: true,
        tipo: 'PUNTOS',
        fechaInicio: new Date(Date.now() - 1000000),
        fechaFin: new Date(Date.now() - 500000),
        recurrencia: 'NINGUNA',
      });

    const torneoBody = torneoRes.body as CreateTorneoResponse;
    const torneoId = torneoBody.id;

    const res = await request(app.getHttpServer())
      .get(`/api/v1/torneos/${torneoId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    const torneo = res.body as TorneoResponse;
    expect(torneo.estado).toBe('FINALIZADO');
  });

  afterAll(async () => {
    await app.close();
  });
});
