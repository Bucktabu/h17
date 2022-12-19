import { DeviceSecurityModel } from '../modules/public/security/infrastructure/entity/deviceSecurity.model';

export const toActiveSessionsViewModel = (device: DeviceSecurityModel) => {
  return {
    deviceId: device.userDevice.deviceId,
    title: device.userDevice.deviceTitle,
    ip: device.userDevice.ipAddress,
    lastActiveDate: new Date(Number(device.userDevice.iat)).toISOString(),
  };
};
