import { Inject, Injectable } from '@nestjs/common';
import { BanInfoRepository } from '../infrastructure/ban-info/banInfo.repository';
import { EmailConfirmationRepository } from '../infrastructure/email-confirmation/email-confirmation.repository';
import { UsersRepository } from '../infrastructure/users/users.repository';
import { ContentPageModel } from '../../../global-model/contentPage.model';
import { UserDBModel } from '../infrastructure/entity/userDB.model';
import { UserViewModelWithBanInfo } from '../api/dto/userView.model';
import {
  _generateHash,
  paginationContentPage,
} from '../../../helper.functions';
import { QueryParametersDto } from '../../../global-model/query-parameters.dto';
import { BanUserDTO } from '../api/dto/ban-user.dto';
import { IBlogsRepository } from '../../public/blogs/infrastructure/blogs-repository.interface';
import { IBanInfo } from '../infrastructure/ban-info/ban-info.interface';
import { IEmailConfirmation } from '../infrastructure/email-confirmation/email-confirmation.interface';
import { ILikesRepository } from '../../public/likes/infrastructure/likes-repository.interface';
import { IUsersRepository } from '../infrastructure/users/users-repository.interface';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../infrastructure/entity/users.scheme";
import { Repository } from "typeorm";
import { UserEntity } from "../infrastructure/entity/user.entity";
import { PgUsersRepository } from "../infrastructure/users/pg-users.repository";
import { EmailConfirmationEntity } from "../infrastructure/entity/email-confirmation.entity";
import { PgEmailConfirmationRepository } from "../infrastructure/users/pg-email-confirmation.repository";
import { BanInfoEntity } from "../infrastructure/entity/ban-info.entity";
import { PgBanInfoRepository } from "../infrastructure/users/pg-ban-info.repository";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(BanInfoEntity) protected banInfoRepository: PgBanInfoRepository,
    @Inject(IBlogsRepository) protected blogsRepository: IBlogsRepository,
    @InjectRepository(EmailConfirmationEntity) protected emailConfirmationRepository: PgEmailConfirmationRepository,
    @Inject(ILikesRepository) protected likesRepository: ILikesRepository,
    @InjectRepository(UserEntity) protected usersRepository: PgUsersRepository,
    //@InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  // async getUserByIdOrLoginOrEmail(
  //   IdOrLoginOrEmail: string,
  // ): Promise<UserDBModel | null> {
  //   return this.usersRepository.getUserByIdOrLoginOrEmail(IdOrLoginOrEmail);
  // }

  async getUsers(query: QueryParametersDto): Promise<ContentPageModel> {
    const users = await this.usersRepository.getUsers(query);
    // const users = await Promise.all(
    //   usersDB.map(async (u) => await this.addBanInfo(u)),
    // );

    const totalCount = users.length;

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      users,
      totalCount,
    );
  }

  // async updateUserPassword(
  //   userId: string,
  //   newPassword: string,
  // ): Promise<boolean> {
  //   const hash = await _generateHash(newPassword);
  //
  //   return await this.usersRepository.updateUserPassword(
  //     userId,
  //     hash.passwordSalt,
  //     hash.passwordHash,
  //   );
  // }

  async updateBanStatus(userId: string, dto: BanUserDTO) {
    let banDate = null;
    let banReason = null;
    if (dto.isBanned) {
      banDate = new Date();
      banReason = dto.banReason;
    }
    await this.blogsRepository.updateBanStatus(userId, dto.isBanned);
    await this.likesRepository.updateBanStatus(userId, dto.isBanned);
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
