import { Inject, Injectable } from '@nestjs/common';
import { UserDTO } from '../api/dto/userDTO';
import { UserDBModel } from '../infrastructure/entity/userDB.model';
import { EmailConfirmationModel } from '../infrastructure/entity/emailConfirmation.model';
import add from 'date-fns/add';
import { BanInfoModel } from '../infrastructure/entity/banInfo.model';
import { UserAccountModel } from '../infrastructure/entity/userAccount.model';
import { toCreateUserViewModel } from '../../../data-mapper/to-create-user-view.model';
import { v4 as uuidv4 } from 'uuid';
import { _generateHash } from '../../../helper.functions';
import { settings } from '../../../settings';
import { IBanInfo } from '../infrastructure/ban-info/ban-info.interface';
import { IEmailConfirmation } from '../infrastructure/email-confirmation/email-confirmation.interface';
import { IUsersRepository } from '../infrastructure/users/users-repository.interface';
import { InjectRepository } from "@nestjs/typeorm";
import { PgUsersRepository } from "../infrastructure/users/pg-users.repository";
import { UserEntity } from "../infrastructure/entity/user.entity";
import { PgEmailConfirmationRepository } from "../infrastructure/users/pg-email-confirmation.repository";
import { EmailConfirmationEntity } from "../infrastructure/entity/email-confirmation.entity";
import { PgBanInfoRepository } from "../infrastructure/users/pg-ban-info.repository";
import { BanInfoEntity } from "../infrastructure/entity/ban-info.entity";
import { UserViewModelWithBanInfo } from "../api/dto/userView.model";

@Injectable()
export class CreateUserUseCase {
  constructor(
    @InjectRepository(BanInfoEntity) protected banInfoRepository: PgBanInfoRepository,
    @InjectRepository(EmailConfirmationEntity) protected emailConfirmationRepository: PgEmailConfirmationRepository,
    @InjectRepository(UserEntity) protected usersRepository: PgUsersRepository, // TODO в видео не создает ентити, а тут просит его прокинуть
  ) {}

  async execute(dto: UserDTO) {
    const hash = await _generateHash(dto.password);
    //const userAccountId = uuidv4();
    //const createdAt = new Date().toISOString()

    //const accountData = UserDBModel.makeInstance(userAccountId, dto, hash, createdAt)

    const accountData = new UserDBModel(
      //userAccountId,
      dto.login,
      dto.email,
      hash.passwordSalt,
      hash.passwordHash,
      new Date().toISOString(),
      false,
    );

    const emailConfirmation = new EmailConfirmationModel(
      //userAccountId,
      uuidv4(),
      add(new Date(), { hours: Number(settings.timeLife.CONFIRMATION_CODE) }),
      false,
    );

    const banInfo = new BanInfoModel(
      //userAccountId,
      false,
      null,
      null,
      null,
      dto.login,
    );

    const userAccount = new UserAccountModel(
      accountData,
      banInfo,
      emailConfirmation,
    );

    const createdAccount = await this.createUserAccount(userAccount);

    if (!createdAccount) {
      return null;
    }

    const createdUser = toCreateUserViewModel(accountData, banInfo);

    return {
      user: createdUser,
      email: accountData.email, // убрать
      code: emailConfirmation.confirmationCode,
    };
  }

  private async createUserAccount(
    userAccount: UserAccountModel,
  ): Promise<boolean> {
    const user = await this.usersRepository.createUser(userAccount.accountData); // TODO нужно создать, сделать запрос, чтобы узнать айди
    await this.banInfoRepository.createBanInfo(userAccount.banInfo);
    const emailConfirmation =
      await this.emailConfirmationRepository.createEmailConfirmation(
        userAccount.emailConfirmation,
      );

    if (!user || !emailConfirmation) {
      return false;
    }

    return true;
  }
}
