import { UserDBModel } from './userDB.model';
import { EmailConfirmationModel } from './emailConfirmation.model';
import { BanInfoModel } from './banInfo.model';

export class UserAccountModel {
  constructor(
    public accountData: UserDBModel,
    public banInfo: BanInfoModel,
    public emailConfirmation: EmailConfirmationModel,
  ) {}
}
