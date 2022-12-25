import { DeviceSecurityModel } from './entity/deviceSecurity.model';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { UserDeviceModel } from "./entity/userDevice.model";

@Injectable()
export class PgSecurityRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createUserDevice(
    createDevice: UserDeviceModel,
  ): Promise<DeviceSecurityModel | null> {
    try {
      return await this.dataSource.query(`
        INSERT INTO public.security_device
        (user_id, device_id, device_title, browser, ip_address, iat, exp)
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
        UPDATE public.security_device
           SET iat = ${iat}, exp = ${exp}
         WHERE device_id = ${deviceId};
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
        DELETE FROM public.security_device
         WHERE user_id = ${userId} AND device_id != ${deviceId}
      `)
      return true;
    } catch (e) {
      return false;
    }
  }

  async deleteDeviceById(deviceId: string): Promise<boolean> {
    try {
      await this.dataSource.query(`
        DELETE FROM public.security_device
         WHERE device_id = ${deviceId}
      `)
      return true;
    } catch (e) {
      return false;
    }
  }
}
