import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { EmailConfirmationModel } from "../entity/emailConfirmation.model";

@Injectable()
export class PgEmailConfirmationRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  }

  async createEmailConfirmation(emailConfirmation: EmailConfirmationModel): Promise<EmailConfirmationModel | null> {
    try {
      await this.dataSource.query(`
        INSERT INTO public."Users"(
              "confirmation_code", "expiration_date", "is_confirmation")
          VALUES (emailConfirmation.confirmationCode, emailConfirmation.expirationDate, emailConfirmation.isConfirmation);
        `)
      return emailConfirmation
    } catch (e) {
      return null
    }
  }
}