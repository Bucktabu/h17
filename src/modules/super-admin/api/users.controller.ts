import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthBasicGuard } from '../../../guards/auth.basic.guard';
import { UsersService } from '../application/users.service';
import { QueryParametersDto } from '../../../global-model/query-parameters.dto';
import { UserDTO } from './dto/userDTO';
import { UserViewModel } from './dto/userView.model';
import { BanUserDTO } from './dto/ban-user.dto';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';

@UseGuards(AuthBasicGuard)
@Controller('sa/users')
export class UsersController {
  constructor(
    protected usersService: UsersService,
    protected createUserUseCase: CreateUserUseCase,
  ) {}

  @Get()
  getUsers(
    @Query()
    query: QueryParametersDto,
  ) {
    return this.usersService.getUsers(query);
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() dto: UserDTO): Promise<UserViewModel> {
    const result = await this.createUserUseCase.execute(dto);

    return result.user;
  }

  @Put(':userId/ban')
  @HttpCode(204)
  async updateBanStatus(
    @Body() dto: BanUserDTO,
    @Param('userId') userId: string,
  ) {
    return await this.usersService.updateBanStatus(userId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUsersById(@Param('id') userId: string) {
    const result = await this.usersService.deleteUserById(userId);

    if (!result) {
      throw new NotFoundException();
    }

    return;
  }
}
