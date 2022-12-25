import { Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { DeviceSecurityModel } from "./entity/deviceSecurity.model"


@Injectable()
export class PgQuerySecurityRepository {
	constructor(@InjectDataSource() private dataSource: DataSource) {}

	async getAllActiveSessions(userId: string): Promise<DeviceSecurityModel[]> {
    return await this.dataSource.query(`
      SELECT user_id as "userId", device_id as "deviceId", device_title as "deviceTitle", browser as "browser", ip_address as "ipAddress", iat, exp
        FROM public.security_device
       WHERE user_id = ${userId};
    `)
  }

  async getDeviseById(deviceId: string): Promise<DeviceSecurityModel | null> {
    return await this.dataSource.query(`
      SELECT user_id as "userId", device_id as "deviceId", device_title as "deviceTitle", browser as "browser", ip_address as "ipAddress", iat, exp
        FROM public.security_device
       WHERE device_id = ${deviceId};
    `)
  }
}