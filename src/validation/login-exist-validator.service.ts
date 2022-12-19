import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from '../modules/super-admin/infrastructure/users/users-repository.interface';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'login', async: true })
export class LoginExistValidator implements ValidatorConstraintInterface {
  constructor(
    @Inject(IUsersRepository) protected usersRepository: IUsersRepository,
  ) {}

  async validate(login) {
    const user = await this.usersRepository.getUserByIdOrLoginOrEmail(login);

    if (user) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'This login already exists';
  }
}
