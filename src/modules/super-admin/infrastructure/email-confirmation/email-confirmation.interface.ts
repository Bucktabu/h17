import { EmailConfirmationModel } from '../entity/emailConfirmation.model';

export interface IEmailConfirmation {
  getEmailConfirmationByCodeOrId(
    codeOrId: string,
  ): Promise<EmailConfirmationModel | null>;
  checkConfirmation(id: string): Promise<boolean | null>;
  createEmailConfirmation(
    emailConfirmation: EmailConfirmationModel,
  ): Promise<EmailConfirmationModel | null>;
  updateConfirmationCode(
    id: string,
    confirmationCode: string,
    expirationDate?: Date,
  ): Promise<boolean>;
  updateConfirmationInfo(idOrCode: string): Promise<boolean>;
  deleteEmailConfirmationById(id: string): Promise<boolean>;
}

export const IEmailConfirmation = 'IEmailConfirmation';
