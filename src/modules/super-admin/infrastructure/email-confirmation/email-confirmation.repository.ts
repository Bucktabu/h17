import { Injectable } from '@nestjs/common';
import { EmailConfirmationModel } from '../entity/emailConfirmation.model';
import { IEmailConfirmation } from './email-confirmation.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  EmailConfirmation,
  EmailConfirmationDocument,
} from '../entity/emailConfirm.scheme';

@Injectable()
export class EmailConfirmationRepository implements IEmailConfirmation {
  constructor(
    @InjectModel(EmailConfirmation.name)
    private emailConfirmationRepository: Model<EmailConfirmationDocument>,
  ) {}

  async getEmailConfirmationByCodeOrId(
    codeOrId: string,
  ): Promise<EmailConfirmationModel | null> {
    // TODO Type error
    return this.emailConfirmationRepository.findOne(
      { $or: [{ confirmationCode: codeOrId }, { id: codeOrId }] },
      { _id: false, __v: false },
    );
  }

  async checkConfirmation(id: string): Promise<boolean | null> {
    try {
      const result = await this.emailConfirmationRepository.findOne(
        { id },
        {
          _id: false,
          id: false,
          confirmationCode: false,
          expirationDate: false,
          __v: false,
        },
      );

      return result.isConfirmed;
    } catch (e) {
      return null;
    }
  }

  async createEmailConfirmation(
    emailConfirmation: EmailConfirmationModel,
  ): Promise<EmailConfirmationModel | null> {
    try {
      await this.emailConfirmationRepository.create(emailConfirmation);
      return emailConfirmation;
    } catch (e) {
      return null;
    }
  }

  async updateConfirmationCode(
    id: string,
    confirmationCode: string,
    expirationDate?: Date,
  ): Promise<boolean> {
    const result = await this.emailConfirmationRepository.updateOne(
      { id },
      { $set: { confirmationCode, expirationDate } },
    );

    return result.modifiedCount === 1;
  }

  async updateConfirmationInfo(idOrCode: string): Promise<boolean> {
    const result = await this.emailConfirmationRepository.updateOne(
      { idOrCode },
      { $set: { isConfirmed: true } },
    );

    return result.modifiedCount === 1;
  }

  async deleteEmailConfirmationById(id: string): Promise<boolean> {
    const result = await this.emailConfirmationRepository.deleteOne({ id });

    return result.deletedCount === 1;
  }
}
