import { BanInfoModel } from '../entity/banInfo.model';
import { BanUserDto } from '../../../blogger/api/dto/ban-user.dto';
import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';

export interface IBanInfo {
  getBanInfo(id: string): Promise<BanInfoModel>;
  getBannedUsers(
    blogId: string,
    query: QueryParametersDto,
  ): Promise<BanInfoModel[]>;
  getTotalCount(id: string, query: QueryParametersDto): Promise<number>;
  checkBanStatus(userId: string, postId: string): Promise<boolean>;
  createBanInfo(banInfo: BanInfoModel): Promise<BanInfoModel | null>;
  saUpdateBanStatus(
    id: string,
    isBanned: boolean,
    banDate: Date,
    banReason?: string,
  ): Promise<boolean>;
  bloggerUpdateBanStatus(
    userId: string,
    dto: BanUserDto,
    banDate: Date,
    userLogin: string,
  ): Promise<boolean>;
  deleteBanInfoById(id: string): Promise<boolean>;
  getTotalCount(blogId: string): Promise<number>;
}

export const IBanInfo = 'IBanInfo';
