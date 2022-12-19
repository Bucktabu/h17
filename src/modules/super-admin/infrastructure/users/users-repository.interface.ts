import { UserDBModel } from '../entity/userDB.model';
import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';

export interface IUsersRepository {
  getUserByIdOrLoginOrEmail(
    IdOrLoginOrEmail: string,
  ): Promise<UserDBModel | null>;
  getUsers(query: QueryParametersDto): Promise<UserDBModel[]>;
  getLogin(id: string): Promise<string>;
  getTotalCount(query: QueryParametersDto): Promise<number>;
  createUser(newUser: UserDBModel): Promise<UserDBModel | null>;
  updateUserPassword(
    userId: string,
    passwordSalt: string,
    passwordHash: string,
  ): Promise<boolean>;
  deleteUserById(userId: string): Promise<boolean>;
}

export const IUsersRepository = 'IUsersRepository';
