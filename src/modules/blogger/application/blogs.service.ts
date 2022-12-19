import { Inject, Injectable } from '@nestjs/common';
import { BlogDto } from '../api/dto/blog.dto';
import { ContentPageModel } from '../../../global-model/contentPage.model';
import { toBlogViewModel } from '../../../data-mapper/to-blog-view.model';
import { paginationContentPage } from '../../../helper.functions';
import { v4 as uuidv4 } from 'uuid';
import { QueryParametersDto } from '../../../global-model/query-parameters.dto';
import { BlogDBModel } from '../../public/blogs/infrastructure/entity/blog-db.model';
import { BlogViewModel } from '../../public/blogs/api/dto/blogView.model';
import { BanUserDto } from '../api/dto/ban-user.dto';
import { IBanInfo } from '../../super-admin/infrastructure/ban-info/ban-info.interface';
import { BanInfoModel } from '../../super-admin/infrastructure/entity/banInfo.model';
import { ViewBanInfoModel } from '../api/dto/view-ban-info.model';
import { IUsersRepository } from '../../super-admin/infrastructure/users/users-repository.interface';
import { IBlogsRepository } from '../../public/blogs/infrastructure/blogs-repository.interface';

@Injectable()
export class BloggerBlogService {
  constructor(
    @Inject(IBanInfo) protected banInfoRepository: IBanInfo,
    @Inject(IBlogsRepository)
    protected blogsRepository: IBlogsRepository,
    @Inject(IUsersRepository) protected userRepository: IUsersRepository,
  ) {}

  async getBlogs(
    userId: string,
    query: QueryParametersDto,
  ): Promise<ContentPageModel | null> {
    const blogs = await this.blogsRepository.getBlogs(query, userId);

    if (!blogs) {
      return null;
    }

    const totalCount = await this.blogsRepository.getTotalCount(
      query.searchNameTerm,
      userId,
    );

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      blogs,
      totalCount,
    );
  }

  async getBannedUsers(
    blogId: string,
    query: QueryParametersDto,
  ): Promise<ContentPageModel | null> {
    const banInfo = await this.banInfoRepository.getBannedUsers(blogId, query);

    if (!banInfo) {
      return null;
    }

    const totalCount = await this.banInfoRepository.getTotalCount(
      blogId,
      query,
    );
    const viewBanInfo = await Promise.all(
      banInfo.map(async (b) => await this.viewBanInfo(b)),
    );

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      viewBanInfo,
      totalCount,
    );
  }

  async createBlog(
    userId: string,
    inputModel: BlogDto,
  ): Promise<BlogViewModel | null> {
    const newBlog = new BlogDBModel(
      uuidv4(),
      userId,
      inputModel.name,
      inputModel.description,
      inputModel.websiteUrl,
      new Date().toISOString(),
      false,
    );

    const createdBlog = await this.blogsRepository.createBlog(newBlog);

    if (!createdBlog) {
      return null;
    }

    return toBlogViewModel(createdBlog);
  }

  async updateBlog(blogId: string, inputModel: BlogDto): Promise<boolean> {
    return await this.blogsRepository.updateBlog(blogId, inputModel);
  }

  async updateUserBanStatus(
    userId: string,
    dto: BanUserDto,
  ): Promise<boolean | null> {
    const banDate = new Date();
    const user = await this.userRepository.getUserByIdOrLoginOrEmail(userId);

    if (!user) {
      return null;
    }

    return await this.banInfoRepository.bloggerUpdateBanStatus(
      userId,
      dto,
      banDate,
      user.login,
    );
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    return await this.blogsRepository.deleteBlog(blogId);
  }

  private async viewBanInfo(banInfo: BanInfoModel): Promise<ViewBanInfoModel> {
    return {
      id: banInfo.parentId,
      login: banInfo.userLogin,
      banInfo: {
        isBanned: banInfo.isBanned,
        banDate: banInfo.banDate,
        banReason: banInfo.banReason,
      },
    };
  }
}
