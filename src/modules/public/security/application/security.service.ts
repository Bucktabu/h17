import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '../../auth/application/jwt.service';
import { DeviceSecurityModel } from '../infrastructure/entity/deviceSecurity.model';
import { UserDeviceModel } from '../infrastructure/entity/userDevice.model';
import UserAgent from 'user-agents';
import { toActiveSessionsViewModel } from '../../../../data-mapper/to-active-session-view.model';
import { TokenPayloadModel } from '../../../../global-model/token-payload.model';
import { ISecurityRepository } from '../infrastructure/security-repository.interface';

@Injectable()
export class SecurityService {
  constructor(
    protected jwtService: JwtService,
    @Inject(ISecurityRepository)
    protected securityRepository: ISecurityRepository,
  ) {}

  async getAllActiveSessions(userId: string) {
    const activeSessions = await this.securityRepository.getAllActiveSessions(
      userId,
    );

    if (!activeSessions.length) {
      return null;
    }

    return activeSessions.map((activeSession) =>
      toActiveSessionsViewModel(activeSession),
    );
  }

  async getDeviceById(deviceId: string): Promise<DeviceSecurityModel | null> {
    const device = await this.securityRepository.getDeviseById(deviceId);

    if (!device) {
      return null;
    }

    return device;
  }

  async createUserDevice(
    tokenPayload: TokenPayloadModel,
    ipAddress: string,
  ): Promise<boolean> {
    const userDeviceInfo: any = new UserAgent().data;

    const userDevice = new UserDeviceModel(
      tokenPayload.deviceId,
      userDeviceInfo.deviceCategory,
      userDeviceInfo.userAgent,
      ipAddress,
      tokenPayload.iat,
      tokenPayload.exp,
    );

    const createDevice = new DeviceSecurityModel(
      tokenPayload.userId,
      userDevice,
    );

    const createdDevice = await this.securityRepository.createUserDevice(
      createDevice,
    );

    if (!createdDevice) {
      return false;
    }

    return true;
  }

  async createNewRefreshToken(refreshToken: string, tokenPayload: any) {
    await this.jwtService.addTokenInBlackList(refreshToken);
    const token = await this.jwtService.createToken(
      tokenPayload.userId,
      tokenPayload.deviceId,
    );
    const newTokenPayload = await this.jwtService.getTokenPayload(
      token.refreshToken,
    );
    await this.securityRepository.updateCurrentActiveSessions(
      newTokenPayload.deviceId,
      newTokenPayload.iat,
      newTokenPayload.exp,
    );

    return token;
  }

  async logoutFromCurrentSession(refreshToken: string) {
    await this.jwtService.addTokenInBlackList(refreshToken);
    const tokenPayload = await this.jwtService.getTokenPayload(refreshToken);
    await this.securityRepository.deleteDeviceById(tokenPayload.deviceId);

    return;
  }

  async deleteAllActiveSessions(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    return await this.securityRepository.deleteAllActiveSessions(
      userId,
      deviceId,
    );
  }

  async deleteDeviceById(deviceId: string): Promise<boolean> {
    return await this.securityRepository.deleteDeviceById(deviceId);
  }
}
