import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { preparedUser, superUser } from "./helper/prepeared-data";
import { isEmail, isUUID } from "class-validator";
import { createErrorMessage } from "./helper/helpers";
import { createApp } from "../src/helpers/create-app";

jest.setTimeout(30000);

describe('e2e tests', () => {

  //STATE
  // user1, user2, user3
  // refToken1User1, refToken2User1, refToken1User2 refToken2User2, refToken1User1, refToken1User1,
  //
  //
  let app: INestApplication;
  let server

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const rawApp = await moduleFixture.createNestApplication();
    app = createApp(rawApp)
    await app.init();
    server = await app.getHttpServer()
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Users route tests', () => {
    const errorsMessage = createErrorMessage(['login', 'password', 'email']);

    it('Shouldn`t create new user. 401 - Unauthorized.', () => {

      //TODO: setState
      // expect.setState({user1: response.body})

      request(server)
        .post('/sa/users')
        .set(preparedUser.valid)
        //.auth(superUser.newValid.login, superUser.newValid.password, { type: 'basic' })
        .set({Authorization: 'Basic'})
        .expect(401)
    })

    it('Shouldn`t create new user. 400 - Short input data.', async () => {
      const response = await request(app.getHttpServer())
        .post('/sa/users')
        .set(preparedUser.short)
        //.auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
        .expect(400)

      expect(response.body).toBe({errorsMessage})
    })

    it('Shouldn`t create new user. 400 - Long input data.', async () => {
      const response = await request(app.getHttpServer())
        .post('/sa/users')
        .set(preparedUser.long)
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
        .expect(400)

      expect(response.body).toBe({errorsMessage})
    })

    it('Should create new user, ban him and return', async () => {
      const response = await request(server)
        .post('/sa/users')
        .set(preparedUser.valid)
        .auth(superUser.valid.login, superUser.valid.password, { type: 'basic' })
        .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
        .expect(201)

      //TODO: getState
      // const user1 = expect.getState().user1
      // const { user1, user2 } = expect.getState()

      expect(isUUID(response.body.id)).toBeTruthy()
      expect(isEmail(response.body.email)).toBeTruthy()
      expect(response.body).toBe({
        id: expect.any(String),
        login: preparedUser.valid.login,
        email: preparedUser.valid.email,
        createdAt: expect.stringMatching(
          /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
        ),
        banInfo: {
          isBanned: false,
          banDate: null,
          banReason: null
        }
      })

      request(app.getHttpServer())
        .put(`/sa/users/${response.body.id}/ban`)
        .set(
          {
            "isBanned": true,
            "banReason": "stringstringstringst"
          }
        )
        .set({Authorization: 'Basic'})
        .expect(401)

      const error = await request(app.getHttpServer())
        .put(`/sa/users/${response.body.id}/ban`)
        .set(
          {
            isBanned: true,
            banReason: "Length-19_stringstr"
          }
        )
        .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
        .expect(400)

      const errorMessage = createErrorMessage(['banReason'])

      expect(error.body).toBe(errorMessage)

      request(app.getHttpServer())
        .put(`/sa/users/${response.body.id}/ban`)
        .set(
          {
            "isBanned": true,
            "banReason": "stringstringstringst"
          }
        )
        .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
        .expect(204)

      request(app.getHttpServer())
        .get('/sa/users')
        //.auth(superUser.newValid.login, superUser.newValid.password, { type: 'basic' })
        .set({Authorization: 'Basic '})
        .expect(401)

      const returnedUser = await request(app.getHttpServer())
        .get('/sa/users')
        //.auth(superUser.newValid.login, superUser.newValid.password, { type: 'basic' })
        .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
        .expect(200)

      expect(returnedUser.body).toBe({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [
          {
            id: expect.any(String),
            login: preparedUser.valid.login,
            email: preparedUser.valid.email,
            createdAt: expect.stringMatching(
              /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
            ),
            banInfo: {
              isBanned: true,
              banDate: expect.any(String),
              banReason: expect.any(Date)
            }
          }
        ]
      })
    })
  })
});
