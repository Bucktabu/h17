import { Injectable } from '@nestjs/common';
import { UserDTO } from '../api/dto/userDTO';
import { UserDBModel } from '../infrastructure/entity/userDB.model';
import { EmailConfirmationModel } from '../infrastructure/entity/emailConfirmation.model';
import add from 'date-fns/add';
import { BanInfoModel } from '../infrastructure/entity/banInfo.model';
import { toCreateUserViewModel } from '../../../data-mapper/to-create-user-view.model';
import { v4 as uuidv4 } from 'uuid';
import { _generateHash } from '../../../helper.functions';
import { settings } from '../../../settings';
import { PgUsersRepository } from "../infrastructure/pg-users.repository";
import { PgEmailConfirmationRepository } from "../infrastructure/pg-email-confirmation.repository";
import { PgBanInfoRepository } from "../infrastructure/pg-ban-info.repository";


@Injectable()
export class CreateUserUseCase {
  constructor(
    protected banInfoRepository: PgBanInfoRepository,
    protected emailConfirmationRepository: PgEmailConfirmationRepository,
    protected usersRepository: PgUsersRepository,
  ) {}

  async execute(dto: UserDTO, creator) {
    const hash = await _generateHash(dto.password);
    const userAccountId = uuidv4();

    const accountData = new UserDBModel(
      userAccountId,
      dto.login,
      dto.email,
      hash.passwordSalt,
      hash.passwordHash,
      new Date().toISOString(),
    );

    // if (creator === 'sa') {
    //
    // }

    const emailConfirmation = new EmailConfirmationModel(
      userAccountId,
      uuidv4(),
      add(new Date(), { hours: Number(settings.timeLife.CONFIRMATION_CODE) }),
      false,
    );

    const banInfo = new BanInfoModel(
      userAccountId,
      false,
      null,
      null,
      null,
    );

    const createdAccount = await this.createUserAccount(accountData, emailConfirmation, banInfo);

    if (!createdAccount) {
      return null;
    }

    const createdUser = toCreateUserViewModel(accountData, banInfo);

    return {
      user: createdUser,
      code: emailConfirmation.confirmationCode,
    };
  }

  private async createUserAccount(
    accountData: UserDBModel,
    confirmation: EmailConfirmationModel,
    banInfo: BanInfoModel
  ): Promise<boolean> {
    const user = await this.usersRepository.createUser(accountData);
    await this.banInfoRepository.createBanInfo(banInfo);
    const emailConfirmation =
      await this.emailConfirmationRepository.createEmailConfirmation(
        confirmation,
      );

    if (!user || !emailConfirmation) {
      return false;
    }

    return true;
  }
}
