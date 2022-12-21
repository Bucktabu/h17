import { Injectable, PipeTransform } from '@nestjs/common';
import { EmailConfirmationService } from '../modules/super-admin/application/emailConfirmation.service';
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../modules/super-admin/infrastructure/entity/user.entity";
import { PgUsersRepository } from "../modules/super-admin/infrastructure/pg-users.repository";

@Injectable()
export class EmailResendingValidationPipe implements PipeTransform {
  constructor(
    protected emailConfirmationService: EmailConfirmationService,
    protected usersRepository: PgUsersRepository,
  ) {}

  async transform(dto, metadata) {
    const email = dto.email;
    const user = await this.usersRepository.getUserByIdOrLoginOrEmail(email);

    if (!user) {
      return false;
    }

    const isConfirmed = await this.emailConfirmationService.checkConfirmation(
      user.id,
    );

    if (isConfirmed) {
      return false;
    }

    return user;
  }
}
