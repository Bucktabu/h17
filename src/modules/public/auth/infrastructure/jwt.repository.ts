import {
  TokenBlackList,
  TokenBlackListDocument,
} from './entity/tokenBlackList.scheme';
import { IJwtRepository } from './jwt-repository.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class JwtRepository implements IJwtRepository {
  constructor(
    @InjectModel(TokenBlackList.name)
    private jwtRepository: Model<TokenBlackListDocument>,
  ) {}

  async giveToken(refreshToken: string): Promise<string> {
    return this.jwtRepository.findOne({ refreshToken });
  }

  async addTokenInBlackList(refreshToken: string): Promise<boolean> {
    try {
      await this.jwtRepository.create({ refreshToken });
      return true;
    } catch (e) {
      return false;
    }
  }
}
