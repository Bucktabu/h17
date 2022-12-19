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

@Injectable()
export class UsersService {
  constructor(
    @Inject(IBanInfo) protected banInfoRepository: IBanInfo,
    @Inject(IBlogsRepository) protected blogsRepository: IBlogsRepository,
    @Inject(IEmailConfirmation)
    protected emailConfirmationRepository: IEmailConfirmation,
    @Inject(ILikesRepository) protected likesRepository: ILikesRepository,
    @Inject(IUsersRepository) protected usersRepository: IUsersRepository,
    //@InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async getUserByIdOrLoginOrEmail(
    IdOrLoginOrEmail: string,
  ): Promise<UserDBModel | null> {
    return this.usersRepository.getUserByIdOrLoginOrEmail(IdOrLoginOrEmail);
  }

  async getUsers(query: QueryParametersDto): Promise<ContentPageModel> {
    const usersDB = await this.usersRepository.getUsers(query);
    const users = await Promise.all(
      usersDB.map(async (u) => await this.addBanInfo(u)),
    );

    const totalCount = await this.usersRepository.getTotalCount(query);

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      users,
      totalCount,
    );
  }

  async updateUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<boolean> {
    const hash = await _generateHash(newPassword);

    return await this.usersRepository.updateUserPassword(
      userId,
      hash.passwordSalt,
      hash.passwordHash,
    );
  }

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

  private async addBanInfo(
    userDB: UserDBModel,
  ): Promise<UserViewModelWithBanInfo> {
    const banInfo = await this.banInfoRepository.getBanInfo(userDB.id);

    return {
      id: userDB.id,
      login: userDB.login,
      email: userDB.email,
      createdAt: userDB.createdAt,
      banInfo,
    };
  }
}
