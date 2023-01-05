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

  describe('GET -> "/sa/users": should return status 200;' +
    'content: users array with pagination; used' +
    'additional methods: POST -> /sa/users;', () => {

    it('Drop all data.', () => {
      request(server)
          .delete('/testing/all-data')
          .expect(204)
    })

    it('Create 9 users', async () => {
      await request(server)
        .post(`/sa/users`)
        .send({
          login: "loSer",
          password: "qwerty1",
          email: "email2p@gg.om"
        })
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .expect(201)

      await request(server)
        .post(`/sa/users`)
        .send({
          login: "log01",
          password: "qwerty1",
          email: "emai@gg.com"
        })
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .expect(201)

      await request(server)
        .post(`/sa/users`)
        .send({
          login: "log02",
          password: "qwerty1",
          email: "email2p@g.com"
        })
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .expect(201)

      await request(server)
        .post(`/sa/users`)
        .send({
          login: "user03",
          password: "qwerty1",
          email: "email1p@gg.cou"
        })
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .expect(201)

      await request(server)
        .post(`/sa/users`)
        .send({
          login: "user05",
          password: "qwerty1",
          email: "email1p@gg.coi"
        })
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .expect(201)

      await request(server)
        .post(`/sa/users`)
        .send({
          login: "usr-1-01",
          password: "qwerty1",
          email: "email3@gg.com"
        })
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .expect(201)

      await request(server)
        .post(`/sa/users`)
        .send({
          login: "uer15",
          password: "qwerty1",
          email: "emarrr1@gg.com"
        })
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .expect(201)

      await request(server)
        .post(`/sa/users`)
        .send({
          login: "user01",
          password: "qwerty1",
          email: "email1p@gg.cm"
        })
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .expect(201)

      await request(server)
        .post(`/sa/users`)
        .send({
          login: "user02",
          password: "qwerty1",
          email: "email1p@gg.com"
        })
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .expect(201)
    })

    it('Get users with query', async () => {
      const response = await request(server)
        .get('/sa/users?pageSize=15&pageNumber=1&searchLoginTerm=seR&searchEmailTerm=.com&sortDirection=asc&sortBy=login')
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .expect(200)

      const items = response.body.items
      const usersLogin = items.map(i => i.login)
      const expectUsersLogin = ['loSer', 'log01', 'log02', 'uer15', 'user01', 'user02', 'user03', 'user05', 'usr-1-01']

      expect(expectUsersLogin).toEqual(usersLogin)
    })

  })

  describe('DELETE -> /security/devices/:deviceId: should' +
    'return error if :id from uri param not found; status 404;', () => {
    it('Create user', async () => {
      const res = await request(server)
        .post(`/sa/users`)
        .send({
          login: "loSer",
          password: "qwerty1",
          email: "email2p@gg.om"
        })
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .expect(201)
    })

    it('Login, get token and try delete', async () => {
      const token = await request(server)
        .post(`/auth/login`)
        .send({
          loginOrEmail: "loSer",
          password: "qwerty1"
        })
        .expect(200)

      const response = await request(server)
        .delete('/security/devices/1')
        .set({ Authorization: `Bearer ${token.body.accessToken}` })
        .expect(404)

      console.log(response.body)
    })
  })
});
