import {
  UserDBModel,
  UserWithCountAndBanInfo,
} from '../modules/super-admin/infrastructure/entity/userDB.model';
import { BanInfoModel } from '../modules/super-admin/infrastructure/entity/banInfo.model';

export const toCreateUserViewModel = (
  userDB: UserDBModel,
  banInfo: BanInfoModel,
) => {
  return {
    id: userDB.id,
    login: userDB.login,
    email: userDB.email,
    createdAt: userDB.createdAt,
    banInfo: {
      isBanned: banInfo.isBanned,
      banDate: banInfo.banDate,
      banReason: banInfo.banReason,
    },
  };
};

export const toUserViewModel = (
    user: UserWithCountAndBanInfo
) => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
    banInfo: {
      isBanned: user.isBanned,
      banDate: user.banDate,
      banReason: user.banReason
    }
  }
}
