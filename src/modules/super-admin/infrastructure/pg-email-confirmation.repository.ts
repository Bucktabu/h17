import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { EmailConfirmationModel } from "./entity/emailConfirmation.model";

@Injectable()
export class PgEmailConfirmationRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  }

  async getEmailConfirmationByCodeOrId(
    codeOrId: string,
  ): Promise<EmailConfirmationModel | null> {
    return await this.dataSource.query(`
      SELECT user_id as "userId", confirmation_code as "confirmationCode", expiration_date as "expirationDate", is_confirmed as "isConfirmed"
        FROM public.email_confirmation
       WHERE user_id = '${codeOrId}' OR confirmation_code = '${codeOrId}';
    `)
  }

  async checkConfirmation(userId: string): Promise<boolean | null> {
    try {
      const result = await this.dataSource.query(`
        SELECT is_confirmed
          FROM public.email_confirmation;
         WHERE user_id = '${userId}'
      `)

      if (!result) {
        return null
      }

      return true
    } catch (e) {
      return false
    }
  }

  async createEmailConfirmation(emailConfirmation: EmailConfirmationModel): Promise<EmailConfirmationModel | null> {
    const filter = this.getCreateFilter(emailConfirmation)
    await this.dataSource.query(`
      INSERT INTO public.email_confirmation 
             (user_id, confirmation_code, expiration_date, is_confirmed)
      VALUES (${filter})
    `)

    return emailConfirmation
  }

  async updateConfirmationInfo(confirmation_code: string): Promise<boolean> {
    try {
      await this.dataSource.query(`
        UPDATE public.email_confirmation
           SET is_confirmed = true
         WHERE confirmation_code = '${confirmation_code}';
      `)
    } catch (e) {
      return false
    }
  }

  async updateConfirmationCode(
    userId: string,
    confirmationCode: string,
    expirationDate?: Date,
  ): Promise<boolean> {
    try {
      await this.dataSource.query(`
        UPDATE public.email_confirmation
           SET confirmation_code = '${confirmationCode}', expiration_date = '${expirationDate}' // TODO если необязательный параметр не пришел не перезапишет ли на пустое значение
         WHERE user_id = '${userId}';
      `)
      return true
    } catch (e) {
      return false
    }
  }

  async deleteEmailConfirmationById(userId: string): Promise<boolean> {
    try {
      await this.dataSource.query(`
        DELETE FROM public.email_confirmation
         WHERE user_id = '${userId}';
      `)
      return true
    } catch (e) {
      return false
    }
  }

  private getCreateFilter(emailConfirmation: EmailConfirmationModel): string {
    let filter = `'${emailConfirmation.id}', null, null, '${emailConfirmation.isConfirmed}'`
    if (emailConfirmation.confirmationCode !== null) {
      return filter = `'${emailConfirmation.id}', '${emailConfirmation.confirmationCode}', '${emailConfirmation.expirationDate}', '${emailConfirmation.isConfirmed}'`
    }
    return filter
  }
}