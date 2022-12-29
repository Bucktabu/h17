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
  ): Promise<boolean> {
    const query = `
      INSERT INTO public.security_device
             (user_id, device_id, device_title, browser, ip_address, iat, exp)
      VALUES (${createDevice.userId}, ${createDevice.deviceId}, ${createDevice.deviceTitle}, ${createDevice.browser}, ${createDevice.ipAddress}, ${createDevice.iat}, ${createDevice.exp});
      RETURNING (user_id)
    `
    const result = await this.dataSource.query(query, [
        createDevice.userId, createDevice.deviceId, createDevice.deviceTitle, createDevice.browser, createDevice.ipAddress, createDevice.iat, createDevice.exp
    ])

    if (!result.length) {
      return false
    }
    return true
  }

  async updateCurrentActiveSessions(
    deviceId: string,
    iat: string,
    exp: string,
  ): Promise<boolean> {
    const query = `
      UPDATE public.security_device
         SET iat = $1, exp = $2
       WHERE device_id = $3;
    `
    const result = await this.dataSource.query(query, [iat, exp, deviceId])

    if (result[1] !== 1) {
      return false
    }
    return true
  }

  async deleteAllActiveSessions(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const query = `
      DELETE FROM public.security_device
       WHERE user_id = $1 AND device_id != $2
    `
    await this.dataSource.query(query, [userId, deviceId])
    return true
  }

  async deleteDeviceById(deviceId: string): Promise<boolean> {
    const query = `
      DELETE FROM public.security_device
       WHERE device_id = $1
    `
    const result = await this.dataSource.query(query, [deviceId])

    if (result[1] !== 1) {
      return false
    }
    return true
  }
}
