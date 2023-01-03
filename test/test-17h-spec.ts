import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { preparedUser, superUser } from "./helper/prepeared-data";
import { createApp } from "../src/helpers/create-app";
import { EmailManager } from "../src/modules/public/auth/email-transfer/email.manager";
import { EmailManagerMock } from "./mock/emailAdapter.mock";

jest.setTimeout(30000);

describe('e2e tests', () => {
  let app: INestApplication;
  let server

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailManager)
      .useValue(new EmailManagerMock())
      .compile();

    const rawApp = await moduleFixture.createNestApplication();
    app = createApp(rawApp)
    await app.init();
    server = await app.getHttpServer()
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST -> "/auth/login": Shouldn\'t login banned user.' +
    'Should login unbanned user; status 401; used additional methods:' +
    'POST => /sa/users, PUT => /sa/users/:id/ban;', async () => {
      const createdUser = await request(server)
        .post(`/sa/users`)
        .set(preparedUser.valid)
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .expect(201)

      console.log('---> CREATED USER:', createdUser.body);

      const returnedUser = await request(server)
        .get(`/sa/users/`)
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .expect(201)

      expect(createdUser.body).toEqual(returnedUser.body.item)


  })
});
