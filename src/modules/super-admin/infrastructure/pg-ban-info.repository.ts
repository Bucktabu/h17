import { Injectable } from "@nestjs/common";
import { BanInfoModel } from "./entity/banInfo.model";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class PgBanInfoRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  }

  async getBanInfo(userId: string): Promise<BanInfoModel | null> {
    return await this.dataSource.query(`
      SELECT "UserId" as "userId", "IsBanned" as "isBanned", "BanDate" as "banDate", "BanReason" as "banReason"', "BlogId" as "blogId"
        FROM public."UserBanInfo"
       WHERE "UserId" = ${userId};
    `)
  }

  async createBanInfo(banInfo: BanInfoModel): Promise<BanInfoModel | null> {
    try {
      await this.dataSource.query(`
        INSERT INTO public."user_ban_info"(
              "is_banned", "ban_date", "ban_reason", "blog_id")
          VALUES (banInfo.isBanned, banInfo.banDate, banInfo.banReason, banInfo.blogId);
        `)
      return banInfo
    } catch (e) {
      return null
    }
  }

  async saUpdateBanStatus(userId: string, banStatus: boolean, banReason: string, banDate: Date): Promise<boolean> {
    try {
      await this.dataSource.query(`
        UPDATE public."UserBanInfo"
           SET "BanStatus" = ${banStatus}, "BanDate" = ${banDate}, "BanReason" = ${banReason}
         WHERE "UserId" = ${userId};
      `)
      return true
    } catch (e) {
      return false
    }
  }

  async deleteBanInfoById(userId: string): Promise<boolean> {
    try {
      await this.dataSource.query(`
        DELETE FROM public."UserBanInfo"
         WHERE "userId" = ${userId};
      `)
      return true
    } catch (e) {
      return false
    }
  }
}