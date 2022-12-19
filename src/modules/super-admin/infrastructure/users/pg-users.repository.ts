import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { UserDBModel } from "../entity/userDB.model";
import { QueryParametersDto } from "../../../../global-model/query-parameters.dto";
import { BanStatusModel } from "../../../../global-model/ban-status.model";
import { giveSkipNumber } from "../../../../helper.functions";

@Injectable()
export class PgUsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  }

  async getUserByIdOrLoginOrEmail(
    IdOrLoginOrEmail: string,
  ): Promise<UserDBModel | null> {
    return
  }

  async getUsers(query: QueryParametersDto): Promise<UserDBModel[]> {
    const user = await this.dataSource.query(`
      SELECT id, login, email, createdAt,
          (SELECT "BanStatus" as "isBanned" FROM public."UserBanInfo" WHERE "Id"="Id"),
          (SELECT banDate FROM public."UserBanInfo" WHERE "Id"="Id"),
          (SELECT banReason FROM public."UserBanInfo" WHERE "Id"="Id")
        FROM public."Users";
    `)

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

  async createUser(newUser: UserDBModel): Promise<UserDBModel | null> {
    try {
      await this.dataSource.query(`
        INSERT INTO public."Users"(
              "Login", "Email", "PasswordSalt", "PasswordHash", "CreatedAt")
          VALUES ('newUser.login', 'newUser.email', 'newUser.PasswordSalt', 'newUser.PasswordHash', 'newUser.CreatedAt'); // TODO параметры для сохранения нужно передавать в кавычках?
        `)
      return newUser
    } catch (e) {
      return null
    }
  }
}

// tests > table scheme > request in pg database
