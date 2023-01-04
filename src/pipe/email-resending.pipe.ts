import { Injectable, PipeTransform } from '@nestjs/common';
import { PgQueryUsersRepository } from "../modules/super-admin/infrastructure/pg-query-users.repository";
import { PgEmailConfirmationRepository } from "../modules/super-admin/infrastructure/pg-email-confirmation.repository";

@Injectable()
export class EmailResendingValidationPipe implements PipeTransform {
  constructor(
    protected emailConfirmationService: PgEmailConfirmationRepository,
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
