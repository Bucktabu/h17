import { Inject, Injectable } from '@nestjs/common';
import { EmailConfirmationModel } from '../infrastructure/entity/emailConfirmation.model';
import { IEmailConfirmation } from '../infrastructure/email-confirmation/email-confirmation.interface';

@Injectable()
export class EmailConfirmationService {
  constructor(
    @Inject(IEmailConfirmation)
    protected emailConfirmationRepository: IEmailConfirmation,
  ) {}

  async getConfirmationByCode(code: string): Promise<EmailConfirmationModel> {
    return this.emailConfirmationRepository.getEmailConfirmationByCodeOrId(
      code,
    );
  }

  async checkConfirmation(id: string): Promise<boolean | null> {
    return this.emailConfirmationRepository.checkConfirmation(id);
  }

  async updateConfirmationInfo(idOrCode: string) {
    return this.emailConfirmationRepository.updateConfirmationInfo(idOrCode);
  }
}
