import { DeviceSecurityModel } from './entity/deviceSecurity.model';

export interface ISecurityRepository {
  getAllActiveSessions(userId: string): Promise<DeviceSecurityModel[]>;
  getDeviseById(deviceId: string): Promise<DeviceSecurityModel | null>;
  createUserDevice(
    createDevice: DeviceSecurityModel,
  ): Promise<DeviceSecurityModel | null>;
  updateCurrentActiveSessions(
    deviceId: string,
    iat: string,
    exp: string,
  ): Promise<boolean>;
  deleteAllActiveSessions(userId: string, deviceId: string): Promise<boolean>;
  deleteDeviceById(deviceId: string): Promise<boolean>;
}

export const ISecurityRepository = 'ISecurityRepository';
