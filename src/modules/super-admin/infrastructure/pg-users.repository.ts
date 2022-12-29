import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import {CreatedUserModel, UserDBModel} from "./entity/userDB.model";

@Injectable()
export class PgUsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  }

  async createUser(newUser: UserDBModel): Promise<CreatedUserModel | null> {
    const query = `
      INSERT INTO public.users
             (id, login, email, password_salt, password_hash, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING (id, login, email, created_at);
    `

    const result = await this.dataSource.query(query, [
      newUser.id, newUser.login, newUser.email, newUser.passwordSalt, newUser.passwordHash, newUser.createdAt
    ])

    const userArr = result[0].row.slice(1, -1).split(',')
    const user = {
      id: userArr[0],
      login: userArr[1],
      email: userArr[2],
      createdAt: userArr[3]
    }

    return user
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const query = `
      DELETE FROM public.users
       WHERE id = $1;
    `
    const result = await this.dataSource.query(query, [userId])

    if (result[1] !== 1) {
      return false
    }
    return true
  }
}
