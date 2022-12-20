import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { UserDBModel } from "../entity/userDB.model";
import { QueryParametersDto } from "../../../../global-model/query-parameters.dto";
import { UserViewModelWithBanInfo } from "../../api/dto/userView.model";
import { giveSkipNumber } from "../../../../helper.functions";

@Injectable()
export class PgUsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  }

  async getUsers(query: QueryParametersDto): Promise<UserViewModelWithBanInfo[]> {
    const usersDB = await this.dataSource.query(`
      SELECT id, login, email, createdAt,
          (SELECT "ban_status" as "isBanned" FROM public."user_ban_info" WHERE "id" = "user_id"),
          (SELECT banDate FROM public."UserBanInfo" WHERE "id" = "user_id"),
          (SELECT banReason FROM public."UserBanInfo" WHERE "id" = "user_id")
        FROM public."Users"
       WHERE "ban_status" = '${query.banStatus}' 
         AND login LIKE '%${query.searchLoginTerm}%' 
         AND email LIKE '%${query.searchEmailTerm}%'
       ORDER BY '${query.sortBy}' ${query.sortDirection} //?
       LIMIT ${query.pageSize} OFFSET ${giveSkipNumber(query.pageNumber, query.pageSize)}

        
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

  async createUser(newUser: UserDBModel): Promise<UserDBModel | null> {
    try {
      await this.dataSource.query(`
        INSERT INTO public."Users"(
              "login", "email", "password_salt", "password_hash", "created_at")
          VALUES (newUser.login, newUser.email, newUser.PasswordSalt, newUser.PasswordHash, newUser.CreatedAt); // TODO параметры для сохранения нужно передавать в кавычках?
        `)
      return newUser
    } catch (e) {
      return null
    }
  }
}
