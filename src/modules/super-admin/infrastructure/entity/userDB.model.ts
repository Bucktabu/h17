export class UserDBModel {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public passwordSalt: string,
    public passwordHash: string,
    public createdAt: Date
  ) {}
}

export class CreatedUserModel {
  constructor(
      public id: string,
      public login: string,
      public email: string,
      public createdAt: string
  ) {}
}

export class UserWithCountAndBanInfo {
  constructor(
      public id: string,
      public login: string,
      public email: string,
      public createdAt: string,
      public isBanned: boolean,
      public banDate: Date | null,
      public banReason: string | null,
      public count: number
  ) {}
}