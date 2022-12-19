import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../modules/super-admin/application/users.service';
import { JwtService } from '../modules/public/auth/application/jwt.service';

@Injectable()
export class AuthBearerGuard implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.headers.authorization) {
      throw new UnauthorizedException();
    }

    const accessToken = req.headers.authorization.split(' ')[1];

    const tokenPayload = await this.jwtService.getTokenPayload(accessToken);
    // console.log(tokenPayload);
    if (!tokenPayload) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.getUserByIdOrLoginOrEmail(
      tokenPayload.userId,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    req.user = user;
    req.token = tokenPayload;
    return true;
  }
}
