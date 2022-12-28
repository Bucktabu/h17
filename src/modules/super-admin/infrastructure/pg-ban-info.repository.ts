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
      SELECT user_id as "userId", ban_status as "isBanned", ban_date as "banDate", ban_reason as "banReason", blog_id as "blogId"
        FROM public.user_ban_info
       WHERE user_id = '${userId}';
    `)
  }

  async createBanInfo(banInfo: BanInfoModel): Promise<BanInfoModel> {
    const filter = this.getCreateFilter(banInfo)

    await this.dataSource.query(`
        INSERT INTO public.user_ban_info
               (user_id, ban_status, ban_reason, ban_date, blog_id)
        VALUES (${filter});
    `)

    return banInfo
  }

  async saUpdateBanStatus(userId: string, banStatus: boolean, banReason: string | null, banDate: string | null): Promise<boolean> {
    const filter = this.getUpdateFilter(banStatus, banReason, banDate)
    const result = await this.dataSource.query(`
       UPDATE public.user_ban_info
          SET ${filter}
        WHERE user_id = '${userId}';
    `)

    if (result[1] !== 1) {
      return false
    }
    return true
  }

  async deleteBanInfoById(userId: string): Promise<boolean> {
    try {
      await this.dataSource.query(`
        DELETE 
          FROM public.user_ban_info
         WHERE user_id = '${userId}';
      `)
      return true
    } catch (e) {
      return false
    }
  }

  private getCreateFilter(banInfo: BanInfoModel): string {
    let filter = `'${banInfo.parentId}', '${banInfo.isBanned}', null, null, null`
    if (banInfo.banReason !== null) {
      return filter = `'${banInfo.parentId}', '${banInfo.isBanned}', '${banInfo.banReason}', '${banInfo.banDate}', '${banInfo.blogId}'`
    }
    return filter
  }

  private getUpdateFilter(banStatus: boolean, banReason: string | null, banDate: string | null): string {
    let filter = `ban_status = '${banStatus}', ban_date = null, ban_reason = null`
    if (banReason !== null) {
      return filter = `ban_status = '${banStatus}', ban_date = '${banDate}', ban_reason = '${banReason}'`
    }
    return filter
  }
}