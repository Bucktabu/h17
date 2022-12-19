import { BanInfoModel } from '../entity/banInfo.model';
import { BanInfo, BanInfoDocument } from '../entity/banInfo.scheme';
import { Injectable } from '@nestjs/common';
import { IBanInfo } from './ban-info.interface';
import { BanUserDto } from '../../../blogger/api/dto/ban-user.dto';
import { giveSkipNumber } from '../../../../helper.functions';
import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BanInfoRepository implements IBanInfo {
  constructor(
    @InjectModel(BanInfo.name)
    private banInfoRepository: Model<BanInfoDocument>,
  ) {}

  async getBanInfo(parentId: string): Promise<BanInfoModel> {
    return this.banInfoRepository.findOne(
      { parentId },
      { _id: false, id: false, __v: false },
    );
  }

  async getBannedUsers(
    blogId: string,
    query: QueryParametersDto,
  ): Promise<BanInfoModel[]> {
    return this.banInfoRepository
      .find(
        {
          $and: [
            { blogId },
            { login: { $regex: query.searchLoginTerm, $options: 'i' } },
            { isBanned: true },
          ],
        },
        { _id: false, __v: false },
      )
      .sort({ userLogin: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(query.pageSize)
      .lean();
  }

  async getTotalCount(id: string): Promise<number> {
    return this.banInfoRepository.countDocuments({
      $and: [{ $or: [{ parentId: id }, { blogId: id }] }, { isBanned: true }],
    });
  }

  async createBanInfo(banInfo: BanInfoModel): Promise<BanInfoModel | null> {
    try {
      await this.banInfoRepository.create(banInfo);
      return banInfo;
    } catch (e) {
      return null;
    }
  }

  async checkBanStatus(userId: string, postId: string): Promise<boolean> {
    const result = await this.banInfoRepository.countDocuments({
      $and: [{ parentId: userId }, { postId }, { isBanned: true }],
    });

    return result > 0;
  }

  async saUpdateBanStatus(
    parentId: string,
    isBanned: boolean,
    banDate: Date,
    banReason?: string,
  ): Promise<boolean> {
    try {
      await this.banInfoRepository.updateOne(
        { parentId },
        { $set: { isBanned, banReason, banDate } },
        { upsert: true },
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async bloggerUpdateBanStatus(
    parentId: string,
    dto: BanUserDto,
    banDate: Date,
    userLogin: string,
  ): Promise<boolean> {
    try {
      await this.banInfoRepository.updateOne(
        {
          parentId,
          blogId: dto.blogId,
        },
        {
          $set: {
            isBanned: dto.isBanned,
            banReason: dto.banReason,
            banDate,
            userLogin,
          },
        },
        { upsert: true },
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async deleteBanInfoById(parentId: string): Promise<boolean> {
    const result = await this.banInfoRepository.deleteOne({ parentId });

    return result.deletedCount === 1;
  }
}
