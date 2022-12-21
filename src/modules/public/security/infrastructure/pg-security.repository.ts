import { DeviceSecurityModel } from './entity/deviceSecurity.model';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { UserDeviceModel } from "./entity/userDevice.model";

@Injectable()
export class PgSecurityRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllActiveSessions(userId: string): Promise<DeviceSecurityModel[]> {
    return await this.dataSource.query(`
      SELECT "UserId" as "userId", "DeviceId" as "deviceId", "DeviceTitle" as "deviceTitle", "Browser" as "browser", "IpAddress" as "ipAddress", iat, exp
        FROM public."SecurityDevice"
       WHERE "UserId" = ${userId};
    `)
  }

  async getDeviseById(deviceId: string): Promise<DeviceSecurityModel | null> {
    return await this.dataSource.query(`
      SELECT "UserId" as "userId", "DeviceId" as "deviceId", "DeviceTitle" as "deviceTitle", "Browser" as "browser", "IpAddress" as "ipAddress", iat, exp
        FROM public."SecurityDevice"
       WHERE "DeviceId" = ${deviceId};
    `)
  }

  async createUserDevice(
    createDevice: UserDeviceModel,
  ): Promise<DeviceSecurityModel | null> {
    try {
      return await this.dataSource.query(`
        INSERT INTO public."SecurityDevice"(
            "UserId", "DeviceId", "DeviceTitle", "Browser", "IpAddress", iat, exp)
        VALUES (${createDevice.userId}, ${createDevice.deviceId}, ${createDevice.deviceTitle}, ${createDevice.browser}, ${createDevice.ipAddress}, ${createDevice.iat}, ${createDevice.exp});
      `)
    } catch (e) {
      return null;
    }
  }

  async updateCurrentActiveSessions(
    deviceId: string,
    iat: string,
    exp: string,
  ): Promise<boolean> {
    try {
      await this.dataSource.query(`
        UPDATE public."SecurityDevice"
           SET iat = ${iat}, exp = ${exp}
         WHERE "DeviceId" = ${deviceId};
      `)
      return true
    } catch (e) {
      return false
    }
  }

  async deleteAllActiveSessions(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    try {
      await this.dataSource.query(`
        DELETE FROM public."SecurityDevice"
         WHERE "UserId" = ${userId} AND "DeviceId" != ${deviceId}
      `)
      return true;
    } catch (e) {
      return false;
    }
  }

  async deleteDeviceById(deviceId: string): Promise<boolean> {
    try {
      await this.dataSource.query(`
        DELETE FROM public."SecurityDevice"
         WHERE "DeviceId" = ${deviceId}
      `)
      return true;
    } catch (e) {
      return false;
    }
  }
}
