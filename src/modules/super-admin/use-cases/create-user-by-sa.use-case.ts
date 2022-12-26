import { Injectable } from '@nestjs/common';
import { EmailConfirmationModel } from '../infrastructure/entity/emailConfirmation.model';
import { _generateHash } from '../../../helper.functions';
import { PgEmailConfirmationRepository } from "../infrastructure/pg-email-confirmation.repository";

@Injectable()
export class CreateUserBySaUseCase {
  constructor(
    protected emailConfirmationRepository: PgEmailConfirmationRepository,
  ) {}

  async execute(userAccountId: string): Promise<EmailConfirmationModel> {
    const emailConfirmation = new EmailConfirmationModel(
      userAccountId,
      null,
      null,
      true,
    );

    const user = await this.usersService.createUser()
    return {user.id,}
  }
}