export interface IJwtRepository {
  giveToken(refreshToken: string): Promise<string>;
  addTokenInBlackList(refreshToken: string): Promise<boolean>;
}

export const IJwtRepository = 'IJwtRepository';
