import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { QueryParametersDto } from "../../../global-model/query-parameters.dto";
import { UserViewModelWithBanInfo } from "../api/dto/userView.model";
import { giveSkipNumber } from "../../../helper.functions";
import { UserDBModel } from "./entity/userDB.model";

@Injectable()
export class PgQueryUsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  }

  async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
    const result = await this.dataSource.query(`
        SELECT id, login, email, password_hash as "passwordHash", password_salt as "passwordSalt", created_at as "createdAt"
          FROM public.users
         WHERE login = '${loginOrEmail}' OR email = '${loginOrEmail}'
    `)

    return result[0]
  }

	async getUserById(id: string):Promise<UserDBModel | null> {
    const result = await this.dataSource.query(`
        SELECT id, login, email, password_hash as "passwordHash", password_salt as "passwordSalt", created_at as "createdAt"
          FROM public.users
         WHERE id = '${id}';
    `)

    return result[0]
  }

  async getUsers(query: QueryParametersDto): Promise<UserViewModelWithBanInfo[]> {
    const usersDB = await this.dataSource.query(`
      SELECT id, login, email, created_at,
          (SELECT ban_status as "isBanned" FROM public.user_ban_info WHERE id = user_id),
          (SELECT ban_date as "banDate" FROM public.user_ban_info WHERE id = user_id),
          (SELECT ban_reason as "banReason" FROM public.user_ban_info WHERE id = user_id)
        FROM public.users
       WHERE ban_status = '${query.banStatus}'
         AND login LIKE '%${query.searchLoginTerm}%' 
         AND email LIKE '%${query.searchEmailTerm}%'
       ORDER BY ${query.sortBy} ${query.sortDirection} 
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
     SELECT id
       FROM public.users
      WHERE ban_status = ${query.banStatus}
        AND login LIKE '%${query.searchLoginTerm}%' 
        AND email LIKE '%${query.searchEmailTerm}%';
    `)

    return usersDB.length
  }
}