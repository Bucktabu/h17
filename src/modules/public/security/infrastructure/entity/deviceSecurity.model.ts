import { UserDeviceModel } from './userDevice.model';

export class DeviceSecurityModel {
  constructor(public userId: string, public userDevice: UserDeviceModel) {}
}
