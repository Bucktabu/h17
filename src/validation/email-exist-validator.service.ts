import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PgUsersRepository } from "../modules/super-admin/infrastructure/pg-users.repository";

@Injectable()
@ValidatorConstraint({ name: 'email', async: true })
export class EmailExistValidator implements ValidatorConstraintInterface {
  constructor(
    protected usersRepository: PgUsersRepository,
  ) {}

  async validate(email) {
    const user = await this.usersRepository.getUserByIdOrLoginOrEmail(email);

    if (user) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'This email already exists';
  }
}
