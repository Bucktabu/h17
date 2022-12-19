import { Security, SecurityDocument } from './entity/security.scheme';
import { DeviceSecurityModel } from './entity/deviceSecurity.model';
import { Injectable } from '@nestjs/common';
import { ISecurityRepository } from './security-repository.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SecurityRepository implements ISecurityRepository {
  constructor(
    @InjectModel(Security.name)
    private securityRepository: Model<SecurityDocument>,
  ) {}

  async getAllActiveSessions(userId: string): Promise<DeviceSecurityModel[]> {
    return this.securityRepository
      .find({ userId }, { projection: { _id: false } })
      .lean();
  }

  async getDeviseById(deviceId: string): Promise<DeviceSecurityModel | null> {
    return this.securityRepository.findOne(
      { 'userDevice.deviceId': deviceId },
      { projection: { _id: false } },
    );
  }

  async createUserDevice(
    createDevice: DeviceSecurityModel,
  ): Promise<DeviceSecurityModel | null> {
    try {
      return this.securityRepository.create(createDevice);
    } catch (e) {
      return null;
    }
  }

  async updateCurrentActiveSessions(
    deviceId: string,
    iat: string,
    exp: string,
  ): Promise<boolean> {
    const result = await this.securityRepository.updateOne(
      {
        'userDevice.deviceId': deviceId,
      },
      {
        $set: { 'userDevice.iat': iat, 'userDevice.exp': exp },
      },
    );

    return result.matchedCount === 1;
  }

  async deleteAllActiveSessions(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    try {
      await this.securityRepository.deleteMany({
        userId,
        'userDevice.deviceId': { $ne: deviceId },
      });
      return true;
    } catch (e) {
      console.log('SecurityScheme => deleteAllActiveSessions =>', e);
      return false;
    }
  }

  async deleteDeviceById(deviceId: string): Promise<boolean> {
    const result = await this.securityRepository.deleteOne({
      'userDevice.deviceId': deviceId,
    });

    return result.deletedCount === 1;
  }
}
