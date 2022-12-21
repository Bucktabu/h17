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
      SELECT "UserId" as "userId", "ConfirmationCode" as "confirmationCode", "ExpirationDate" as "expirationDate", "IsConfirmed" as "isConfirmed"
        FROM public."EmailConfirmation"
       WHERE "UserId" = ${codeOrId} OR "ConfirmationCode" = ${codeOrId};
    `)
  }

  async checkConfirmation(userId: string): Promise<boolean | null> {
    try {
      const result = await this.dataSource.query(`
        SELECT "IsConfirmed"
          FROM public."EmailConfirmation";
         WHERE "UserId" = ${userId}
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
    try {
      await this.dataSource.query(`
        INSERT INTO public."Users"("ConfirmationCode", "ExpirationDate", "IsConfirmation")
          VALUES (${emailConfirmation.confirmationCode}, ${emailConfirmation.expirationDate}, ${emailConfirmation.isConfirmed});
        `)
      return emailConfirmation
    } catch (e) {
      return null
    }
  }

  async updateConfirmationInfo(idOrCode: string): Promise<boolean> {
    try {
      await this.dataSource.query(`
        UPDATE public."EmailConfirmation"
           SET "IsConfirmed" = true
         WHERE "UserId" = ${idOrCode} OR "ConfirmationCode" = ${idOrCode};
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
        UPDATE public."EmailConfirmation"
           SET "ConfirmationCode" = ${confirmationCode}, "ExpirationDate" = ${expirationDate} // TODO если необязательный параметр не пришел не перезапишет ли на пустое значение
         WHERE "UserId" = ${userId};
      `)
      return true
    } catch (e) {
      return false
    }
  }

  async deleteEmailConfirmationById(userId: string): Promise<boolean> {
    try {
      await this.dataSource.query(`
        DELETE FROM public."EmailConfirmation"
         WHERE "userId" = ${userId};
      `)
      return true
    } catch (e) {
      return false
    }
  }
}