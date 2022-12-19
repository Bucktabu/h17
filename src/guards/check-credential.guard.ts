import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserDBModel } from '../modules/super-admin/infrastructure/entity/userDB.model';
import { IUsersRepository } from '../modules/super-admin/infrastructure/users/users-repository.interface';
import { IBanInfo } from '../modules/super-admin/infrastructure/ban-info/ban-info.interface';

@Injectable()
export class CheckCredentialGuard implements CanActivate {
  constructor(
    @Inject(IUsersRepository) protected usersRepository: IUsersRepository,
    @Inject(IBanInfo) protected banInfoRepository: IBanInfo,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const user: UserDBModel | null =
      await this.usersRepository.getUserByIdOrLoginOrEmail(
        req.body.loginOrEmail,
      );

    if (!user) {
      throw new UnauthorizedException();
    }

    const banInfo = await this.banInfoRepository.getBanInfo(user.id);

    if (banInfo.isBanned) {
      throw new UnauthorizedException();
    }

    const passwordEqual = await bcrypt.compare(
      req.body.password,
      user.passwordHash,
    );

    if (!passwordEqual) {
      throw new UnauthorizedException();
    }

    req.user = user;
    return true;
  }
}
