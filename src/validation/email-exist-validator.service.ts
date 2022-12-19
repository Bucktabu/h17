import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from '../modules/super-admin/infrastructure/users/users-repository.interface';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'email', async: true })
export class EmailExistValidator implements ValidatorConstraintInterface {
  constructor(
    @Inject(IUsersRepository) protected usersRepository: IUsersRepository,
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
