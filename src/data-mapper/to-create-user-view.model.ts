import { UserDBModel } from '../modules/super-admin/infrastructure/entity/userDB.model';
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
