import supertest from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserDTO } from '../../src/modules/super-admin/api/dto/userDTO';
import { createErrorMessage } from './helpers';

const errorsMessage = createErrorMessage(['login', 'password', 'email']);

export const registrationNewUser = async (
  request: typeof supertest,
  app: INestApplication,
  body: UserDTO,
  statusCode: number,
  error: boolean,
) => {
  const response = await request(app.getHttpServer())
    .post('/auth/registration')
    .send(body)
    .expect(statusCode);

  if (error) {
    expect(response.body).toBe({ errorsMessage });
  }
};
