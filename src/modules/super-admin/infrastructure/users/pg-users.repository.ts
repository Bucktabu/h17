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
    await this.dataSource.query(`
      
    `)
    return
  }
}

// tests > table scheme > request in pg database
