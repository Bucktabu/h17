import { Injectable } from "@nestjs/common";
import { BanInfoModel } from "../entity/banInfo.model";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class PgBanInfoRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
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
        UPDATE public."user_ban_info"
           SET "ban_status" = ${banStatus}, "BanDate" = ${banDate}, "BanReason" = ${banReason}
         WHERE "user_id" = ${userId};
      `)
      return true
    } catch (e) {
      return false
    }
  }
}