import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /auth/login Debe retornar el accessToken', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'usuario123@uninorte.edu.com',
      password: '12345678Ll!',
    });

    expect(res.status).toBe(201);

    const body = res.body as LoginResponse;

    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
