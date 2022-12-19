import { QueryParametersDto } from '../../../global-model/query-parameters.dto';
import { ContentPageModel } from '../../../global-model/contentPage.model';
import { paginationContentPage } from '../../../helper.functions';
import { BindBlogDto } from '../api/dto/bind-blog.dto';
import { Inject, Injectable } from '@nestjs/common';
import { BlogDBModel } from '../../public/blogs/infrastructure/entity/blog-db.model';
import { BlogViewWithOwnerAndBanInfo } from '../api/dto/blog-view-with-owner-and-ban.info';
import { IUsersRepository } from '../infrastructure/users/users-repository.interface';
import { IBanInfo } from '../infrastructure/ban-info/ban-info.interface';
import { IPostsRepository } from '../../public/posts/infrastructure/posts-repository.interface';
import { IBlogsRepository } from '../../public/blogs/infrastructure/blogs-repository.interface';

@Injectable()
export class SaBlogsService {
  constructor(
    @Inject(IBanInfo) protected banInfoRepository: IBanInfo,
    @Inject(IBlogsRepository) protected blogsRepository: IBlogsRepository,
    @Inject(IUsersRepository) protected userRepository: IUsersRepository,
    @Inject(IPostsRepository) protected postsRepository: IPostsRepository,
  ) {}

  async getBlogs(query: QueryParametersDto): Promise<ContentPageModel | null> {
    const blogsDB = await this.blogsRepository.saGetBlogs(query);

    const blogs = await Promise.all(
      blogsDB.map(async (b) => await this.addOwnerInfo(b)),
    );

    const totalCount = await this.blogsRepository.saGetTotalCount(
      query.banStatus,
      query.searchNameTerm,
    );

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      blogs,
      totalCount,
    );
  }

  async bindBlog(params: BindBlogDto) {
    return this.blogsRepository.bindBlog(params);
  }

  async updateBlogBanStatus(
    blogId: string,
    isBanned: boolean,
  ): Promise<boolean> {
    const banDate = new Date();
    await this.postsRepository.updatePostsBanStatus(blogId, isBanned);
    await this.banInfoRepository.saUpdateBanStatus(blogId, isBanned, banDate);
    return this.blogsRepository.updateBanStatus(blogId, isBanned);
  }

  private async addOwnerInfo(
    blog: BlogDBModel,
  ): Promise<BlogViewWithOwnerAndBanInfo> {
    const ownerInfo = await this.userRepository.getUserByIdOrLoginOrEmail(
      blog.userId,
    );

    let userId = null;
    let userLogin = null;
    if (ownerInfo) {
      userId = ownerInfo.id;
      userLogin = ownerInfo.login;
    }

    const banInfo = await this.banInfoRepository.getBanInfo(blog.id);

    let isBanned = false;
    let banDate = null;
    if (banInfo) {
      isBanned = banInfo.isBanned;
      banDate = banInfo.banDate;
    }

    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      blogOwnerInfo: {
        userId,
        userLogin,
      },
      banInfo: {
        isBanned,
        banDate,
      },
    };
  }
}
