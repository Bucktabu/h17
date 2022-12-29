import { Injectable, PipeTransform } from '@nestjs/common';
import { EmailConfirmationService } from '../modules/super-admin/application/emailConfirmation.service';
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../modules/super-admin/infrastructure/entity/user.entity";
import { PgUsersRepository } from "../modules/super-admin/infrastructure/pg-users.repository";
import { PgQueryUsersRepository } from "../modules/super-admin/infrastructure/pg-query-users.repository";

@Injectable()
export class EmailResendingValidationPipe implements PipeTransform {
  constructor(
    protected emailConfirmationService: EmailConfirmationService,
    protected queryUsersRepository: PgQueryUsersRepository,
  ) {}

  async transform(dto, metadata) {
    const email = dto.email;
    const user = await this.queryUsersRepository.getUserByLoginOrEmail(email);

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
