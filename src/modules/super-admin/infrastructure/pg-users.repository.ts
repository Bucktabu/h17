import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { UserDBModel } from "./entity/userDB.model";

@Injectable()
export class PgUsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  }

  async createUser(newUser: UserDBModel): Promise<UserDBModel | null> {
    try {
      await this.dataSource.query(`
        INSERT INTO public.users
        (id, login, email, password_salt, password_hash, created_at)
          VALUES ('${newUser.id}', '${newUser.login}', '${newUser.email}', '${newUser.passwordSalt}', '${newUser.passwordHash}', '${newUser.createdAt}'); 
        `)
      return newUser
    } catch (e) {
      return null
    }
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const result = await this.dataSource.query(`
        DELETE FROM public.users
         WHERE id = '${userId}';
      `)

    if (result[1] !== 1) {
      return false
    }
    return true
  }
}
