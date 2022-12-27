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
import { UserDto } from './dto/userDto';
import { UserViewModel } from './dto/userView.model';
import { BanUserDTO } from './dto/ban-user.dto';
import { CreateUserBySaUseCase } from '../use-cases/create-user-by-sa.use-case';

@UseGuards(AuthBasicGuard)
@Controller('sa/users')
export class UsersController {
  constructor(
    protected usersService: UsersService,
    protected createUserUseCase: CreateUserBySaUseCase,
  ) {}

  @Get()
  getUsers(
    @Query()
    query: QueryParametersDto,
  ) {
    return this.usersService.getUsers(query);
  }

  @Post()
  async createUser(@Body() dto: UserDto): Promise<UserViewModel> {
    const user = await this.createUserUseCase.execute(dto)

    return user;
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
