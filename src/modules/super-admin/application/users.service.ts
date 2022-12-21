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

@Injectable()
export class UsersService {
  constructor(
    protected banInfoRepository: PgBanInfoRepository,
    protected emailConfirmationRepository: PgEmailConfirmationRepository,
    protected usersRepository: PgUsersRepository,
  ) {}

  async getUserByIdOrLoginOrEmail(
    IdOrLoginOrEmail: string,
  ): Promise<UserDBModel | null> {
    return this.usersRepository.getUserByIdOrLoginOrEmail(IdOrLoginOrEmail);
  }

  async getUsers(query: QueryParametersDto): Promise<ContentPageModel> {
    const users = await this.usersRepository.getUsers(query);
    const totalCount = await this.usersRepository.getTotalCount(query)

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      users,
      totalCount,
    );
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
