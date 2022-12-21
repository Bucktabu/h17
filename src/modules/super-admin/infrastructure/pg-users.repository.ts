import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { UserDBModel } from "./entity/userDB.model";
import { QueryParametersDto } from "../../../global-model/query-parameters.dto";
import { UserViewModelWithBanInfo } from "../api/dto/userView.model";
import { giveSkipNumber } from "../../../helper.functions";
import { CheckCredentialGuard } from "../../../guards/check-credential.guard";

@Injectable()
export class PgUsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  }

  async getUserByIdOrLoginOrEmail(IdOrLoginOrEmail: string):Promise<UserDBModel | null> {
    return await this.dataSource.query(`
        SELECT "Id" as "id", "Login" as "login", "Email" as "email", "PasswordHash" as "passwordHash", "PasswordSalt" as "passwordSalt", "CreatedAt" as "createdAt"
          FROM public."Users"
         WHERE "Id" = ${IdOrLoginOrEmail} OR "Login" = ${IdOrLoginOrEmail} OR "Email" = ${IdOrLoginOrEmail};
    `)
  }

  async getUsers(query: QueryParametersDto): Promise<UserViewModelWithBanInfo[]> {
    const usersDB = await this.dataSource.query(`
      SELECT "Id", "Login", "email", "createdAt",
          (SELECT "BanStatus" as "isBanned" FROM public."UserBanInfo" WHERE "Id" = "UserId"),
          (SELECT "BanDate" as "banDate" FROM public."UserBanInfo" WHERE "Id" = "UserId"),
          (SELECT "BanReason" as "banReason" FROM public."UserBanInfo" WHERE "Id" = "UserId")
        FROM public."Users"
       WHERE "BanStatus" = ${query.banStatus}
         AND login LIKE '%${query.searchLoginTerm}%' 
         AND email LIKE '%${query.searchEmailTerm}%'
       ORDER BY ${query.sortBy} ${query.sortDirection} //?
       LIMIT ${query.pageSize} OFFSET ${giveSkipNumber(query.pageNumber, query.pageSize)};
    `)
      // SELECT id, login, email, createdAt,
      //   FROM public.users
      //   LEFT JOIN user_ban_info
      //     ON users.id = user_ban_info.user_id
      //  WHERE "ban_status" = '${query.banStatus}'
      //    AND login LIKE '%${query.searchLoginTerm}%'
      //    AND email LIKE '%${query.searchEmailTerm}%'
      //  ORDER BY '${query.sortBy}' ${query.sortDirection} //?
      //  LIMIT ${query.pageSize} OFFSET ${giveSkipNumber(query.pageNumber, query.pageSize)}

    const users = usersDB.map(u => {
      return {
        id: u.id,
        login: u.login,
        email: u.email,
        createdAt: u.createdAt,
        banInfo: {
          isBanned: u.isBanned,
          banDate: u.banDate,
          banReason: u.banReason
        }
      }
    })

    return users
  }

  async getTotalCount(query: QueryParametersDto): Promise<number> {
    const usersDB = await this.dataSource.query(`
     SELECT "Id"
       FROM public."Users"
      WHERE "BanStatus" = ${query.banStatus}
        AND login LIKE '%${query.searchLoginTerm}%' 
        AND email LIKE '%${query.searchEmailTerm}%';
    `)

    return usersDB.length
  }

  async createUser(newUser: UserDBModel): Promise<UserDBModel | null> {
    try {
      await this.dataSource.query(`
        INSERT INTO public."Users"(
              "Id", "Login", "Email", "PasswordSalt", "PasswordHash", "CreatedAt")
          VALUES (${newUser.id}, ${newUser.login}, ${newUser.email}, ${newUser.passwordSalt}, ${newUser.passwordHash}, ${newUser.createdAt}); 
        `)
      return newUser
    } catch (e) {
      return null
    }
  }

  async deleteUserById(userId: string): Promise<boolean> {
    try {
      await this.dataSource.query(`
        DELETE FROM public."Users"
         WHERE "Id" = ${userId};
      `)
      return true // скорее всего вне зависимости от результата операции вернет true222222222222222222
    } catch (e) {
      return false
    }
  }


}
