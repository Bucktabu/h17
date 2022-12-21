import { Injectable } from '@nestjs/common';
import { EmailConfirmationModel } from '../infrastructure/entity/emailConfirmation.model';
import { InjectRepository } from "@nestjs/typeorm";
import { EmailConfirmationEntity } from "../infrastructure/entity/email-confirmation.entity";
import { PgEmailConfirmationRepository } from "../infrastructure/pg-email-confirmation.repository";

@Injectable()
export class EmailConfirmationService {
  constructor(
    protected emailConfirmationRepository: PgEmailConfirmationRepository,
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
