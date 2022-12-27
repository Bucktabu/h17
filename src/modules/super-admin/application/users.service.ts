import { Injectable } from '@nestjs/common';
import { UserDBModel } from '../infrastructure/entity/userDB.model';
import {
  paginationContentPage,
} from '../../../helper.functions';
import { QueryParametersDto } from '../../../global-model/query-parameters.dto';
import { BanUserDTO } from '../api/dto/ban-user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../infrastructure/entity/user.entity";
import { PgUsersRepository } from "../infrastructure/pg-users.repository";
import { EmailConfirmationEntity } from "../infrastructure/entity/email-confirmation.entity";
import { PgEmailConfirmationRepository } from "../infrastructure/pg-email-confirmation.repository";
import { BanInfoEntity } from "../infrastructure/entity/ban-info.entity";
import { PgBanInfoRepository } from "../infrastructure/pg-ban-info.repository";
import { ContentPageModel } from "../../../global-model/contentPage.model";
import { _generateHash } from '../../../helper.functions';
import { UserDto } from '../api/dto/userDto';
import { CreateUserBySaUseCase } from '../use-cases/create-user-by-sa.use-case';
import { BanInfoModel } from '../infrastructure/entity/banInfo.model';
import { toCreateUserViewModel } from 'src/data-mapper/to-create-user-view.model';
import { EmailConfirmation } from '../infrastructure/entity/emailConfirm.scheme';
import { UserViewModelWithBanInfo } from '../api/dto/userView.model';
import { PgQueryUsersRepository } from '../infrastructure/pg-query-users.repository';

@Injectable()
export class UsersService {
  constructor(
    protected banInfoRepository: PgBanInfoRepository,
    protected emailConfirmationRepository: PgEmailConfirmationRepository,
    protected usersRepository: PgUsersRepository,
    protected queryUsersRepository: PgQueryUsersRepository,
  ) {}

  async getUserByLoginOrEmail(
    LoginOrEmail: string,
  ): Promise<UserDBModel | null> {
    return this.queryUsersRepository.getUserByLoginOrEmail(LoginOrEmail);
  }

  async getUserById(id: string): Promise<UserDBModel | null> {
    return this.queryUsersRepository.getUserById(id)
  }

  async getUsers(query: QueryParametersDto): Promise<ContentPageModel> {
    const users = await this.queryUsersRepository.getUsers(query);
    const totalCount = await this.queryUsersRepository.getTotalCount(query)

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      users,
      totalCount,
    );
  }

  async createUser(dto: UserDto, emailConfirmation: EmailConfirmation, userId: string) {
    const hash = await _generateHash(dto.password);

    const user = new UserDBModel(
      userId,
      dto.login,
      dto.email,
      hash.passwordSalt,
      hash.passwordHash,
      new Date().toISOString(),
    );

    const banInfo = new BanInfoModel(
      userId,
      false,
      null,
      null,
      null,
    );

    await this.usersRepository.createUser(user);
    await this.banInfoRepository.createBanInfo(banInfo);
    await this.emailConfirmationRepository.createEmailConfirmation(
      emailConfirmation,
    )

    return {user, banInfo}
  }

  async updateBanStatus(userId: string, dto: BanUserDTO) {
    let banDate = null;
    let banReason = null;
    if (dto.isBanned) {
      banDate = new Date();
      banReason = dto.banReason;
    }
    //await this.blogsRepository.updateBanStatus(userId, dto.isBanned);
    //await this.likesRepository.updateBanStatus(userId, dto.isBanned);
    return this.banInfoRepository.saUpdateBanStatus(
      userId,
      dto.isBanned,
      banReason,
      banDate,
    );
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const userDeleted = await this.usersRepository.deleteUserById(userId);
    await this.banInfoRepository.deleteBanInfoById(userId);
    await this.emailConfirmationRepository.deleteEmailConfirmationById(userId);

    if (!userDeleted) {
      return false;
    }

    return true;
  }
}
