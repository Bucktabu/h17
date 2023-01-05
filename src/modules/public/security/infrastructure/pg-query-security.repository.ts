import { Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { DeviceSecurityModel } from "./entity/deviceSecurity.model"


@Injectable()
export class PgQuerySecurityRepository {
	constructor(@InjectDataSource() private dataSource: DataSource) {}

	async getAllActiveSessions(userId: string): Promise<DeviceSecurityModel[]> {
    const query = `
      SELECT user_id as "userId", device_id as "deviceId", device_title as "deviceTitle", ip_address as "ipAddress", iat, exp
        FROM public.device_security
       WHERE user_id = $1;
    `
    try {
      const result = await this.dataSource.query(query, [userId])
      return result[0]
    } catch (e) {
      return null
    }
  }

  async getDeviseById(deviceId: string): Promise<DeviceSecurityModel | null> {
    const query = `
      SELECT user_id as "userId", device_id as "deviceId", device_title as "deviceTitle", ip_address as "ipAddress", iat, exp
        FROM public.device_security
       WHERE device_id = $1;
    `
    try {
      const result = await this.dataSource.query(query, [deviceId])
      return result[0]
    } catch (e) {
      return null
    }
  }
}