import { Injectable } from '@nestjs/common';
import { EmailConfirmationModel } from '../infrastructure/entity/emailConfirmation.model';
import add from 'date-fns/add';
import { v4 as uuidv4 } from 'uuid';
import { settings } from '../../../settings';
import { PgEmailConfirmationRepository } from "../infrastructure/pg-email-confirmation.repository";
import { EmailManager } from "../../public/auth/email-transfer/email.manager";

@Injectable()
export class CreateUserUseCase {
  constructor(
    protected emailConfirmationRepository: PgEmailConfirmationRepository,
    protected emailManager: EmailManager,
  ) {}

  async execute(userAccountId: string, email: string): Promise<EmailConfirmationModel> {
    const emailConfirmation = new EmailConfirmationModel(
      userAccountId,
      uuidv4(),
      add(new Date(), { hours: Number(settings.timeLife.CONFIRMATION_CODE) }),
      false,
    );

    await this.emailConfirmationRepository.createEmailConfirmation(
      emailConfirmation,
    )

    this.emailManager.sendConfirmationEmail(
      email,
      emailConfirmation.confirmationCode,
    );

    return emailConfirmation
  }
}