import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { QueryParametersDto } from "../../../global-model/query-parameters.dto";
import { UserViewModelWithBanInfo } from "../api/dto/userView.model";
import { giveSkipNumber } from "../../../helper.functions";
import { UserDBModel } from "./entity/userDB.model";
import {BanStatusModel} from "../../../global-model/ban-status.model";

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
    const filter = this.getFilter(query)

    // const usersDB = await this.dataSource.query(`
    //   SELECT id, login, email, created_at,
    //          (SELECT ban_status as "isBanned" FROM public.user_ban_info WHERE id = user_id),
    //          (SELECT ban_date as "banDate" FROM public.user_ban_info WHERE id = user_id),
    //          (SELECT ban_reason as "banReason" FROM public.user_ban_info WHERE id = user_id)
    //     FROM public.users
    //          ${filter}
    //    ORDER BY "${query.sortBy}" ${query.sortDirection}
    //    LIMIT ${query.pageSize} OFFSET ${giveSkipNumber(query.pageNumber, query.pageSize)};
    // `)
    const usersDB = await this.dataSource.query(`
      SELECT u.id, u.login, u.email, u.created_at as "createdAt",
             b.ban_status as "isBanned", b.ban_date as "banDate", b.ban_reason as "banReason",
             (SELECT COUNT(*) FROM public.users)
        FROM public.users u
        LEFT JOIN public.user_ban_info b
          ON u.id = b.user_id
             ${filter}
       ORDER BY "${query.sortBy}" ${query.sortDirection}
       LIMIT ${query.pageSize} OFFSET ${giveSkipNumber(query.pageNumber, query.pageSize)};
    `)

    console.log(usersDB)

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
    const filter = this.getFilter(query)

    const result = await this.dataSource.query(`
     SELECT COUNT(*) FROM public.users
            ${filter}
    `)

    return Number(result[0].count)
  }

  private getFilter(query: QueryParametersDto): string {
    const banFilter = this.banFilter(query)
    const userFilter = this.userFilter(query)

    if (banFilter && userFilter) {
      return `WHERE ${banFilter} AND ${userFilter}`
    }
    if (banFilter) return `WHERE ${banFilter}`
    if (userFilter) return `WHERE ${userFilter}`
    return ''
  }

  private banFilter(query: QueryParametersDto): string {
    const {banStatus} = query;
    if (banStatus === BanStatusModel.Banned) {
      return `b.ban_status = true`
    }
    if (banStatus === BanStatusModel.NotBanned) {
      return `b.ban_status = false`
    }
    return '';
  }

  private userFilter(query: QueryParametersDto): string {
    const {searchLoginTerm} = query
    const {searchEmailTerm} = query

    const login = `LOWER(login) LIKE '%${searchLoginTerm.toLowerCase()}%'` // ILIKE
    const email = `LOWER(login) LIKE '%${searchEmailTerm.toLowerCase()}%'`

    if (searchLoginTerm && searchEmailTerm) {
      return `${login} OR ${email}`
    }
    if (login) return login
    if (searchEmailTerm) return email
    return ''
  }
}
