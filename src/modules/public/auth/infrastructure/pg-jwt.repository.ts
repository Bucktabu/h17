import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

export class PgJwtRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async getToken(refreshToken: string): Promise<string> {
    return this.dataSource.query(`
      SELECT token
        FROM public.token_black_list
       WHERE token = ${refreshToken};
    `);
  }

  async addTokenInBlackList(refreshToken: string): Promise<boolean> {
    try {
      await this.dataSource.query(`
        INSERT INTO public.token_black_list
        (token)
        VALUES (${refreshToken});
      `)
      return true;
    } catch (e) {
      return false;
    }
  }
}
