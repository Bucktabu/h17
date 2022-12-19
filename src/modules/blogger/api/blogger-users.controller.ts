import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthBearerGuard } from '../../../guards/auth.bearer.guard';
import { BloggerBlogService } from '../application/blogs.service';
import { BanUserDto } from './dto/ban-user.dto';
import { QueryParametersDto } from '../../../global-model/query-parameters.dto';
import { ForbiddenGuard } from '../../../guards/forbidden.guard';
import { readdir } from 'fs/promises';

@UseGuards(AuthBearerGuard, ForbiddenGuard)
@Controller('blogger/users')
export class BloggerUsersController {
  constructor(protected blogsService: BloggerBlogService) {}

  @Get('blog/:id')
  async getBannedUsers(
    @Query() query: QueryParametersDto,
    @Param('id') blogId: string,
  ) {
    const result = await this.blogsService.getBannedUsers(blogId, query);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  @UseGuards(ForbiddenGuard)
  @Put(':id/ban')
  @HttpCode(204)
  async updateUserBanStatus(
    @Body() dto: BanUserDto,
    @Param('id') userId: string,
  ) {
    const result = await this.blogsService.updateUserBanStatus(userId, dto);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }
}
