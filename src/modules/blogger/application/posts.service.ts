import { toPostOutputBeforeCreate } from '../../../data-mapper/to-post-view-before-create.model';
import { PostDto } from '../api/dto/post.dto';
import { PostDBModel } from '../../public/posts/infrastructure/entity/post-db.model';
import { PostViewModel } from '../../public/posts/api/dto/postsView.model';
import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { QueryParametersDto } from '../../../global-model/query-parameters.dto';
import { ContentPageModel } from '../../../global-model/contentPage.model';
import { ICommentsRepository } from '../../public/comments/infrastructure/comments-repository.interface';
import { IBanInfo } from '../../super-admin/infrastructure/ban-info/ban-info.interface';
import { CommentBDModel } from '../../public/comments/infrastructure/entity/commentDB.model';
import { ILikesRepository } from '../../public/likes/infrastructure/likes-repository.interface';
import { CommentWithAdditionalInfoModel } from '../api/dto/comment-with-additional-info.model';
import { paginationContentPage } from '../../../helper.functions';
import { IPostsRepository } from '../../public/posts/infrastructure/posts-repository.interface';
import { IBlogsRepository } from '../../public/blogs/infrastructure/blogs-repository.interface';

@Injectable()
export class BloggerPostService {
  constructor(
    @Inject(ICommentsRepository)
    protected commentsRepository: ICommentsRepository,
    @Inject(IBanInfo) protected banInfoRepository: IBanInfo,
    @Inject(IPostsRepository)
    protected postsRepository: IPostsRepository,
    @Inject(IBlogsRepository)
    protected blogsRepository: IBlogsRepository,
    @Inject(ILikesRepository) protected likeRepository: ILikesRepository,
  ) {}

  async createPost(
    dto: PostDto,
    blogId: string,
  ): Promise<PostViewModel | null> {
    const newPost = new PostDBModel(
      uuidv4(),
      dto.title,
      dto.shortDescription,
      dto.content,
      blogId,
      await this.getBlogName(blogId),
      new Date().toISOString(),
      false,
    );

    const createdPost = await this.postsRepository.createPost(newPost);

    if (!createdPost) {
      return null;
    }

    return toPostOutputBeforeCreate(createdPost);
  }

  async getBlogName(blogId: string): Promise<string> {
    const blog = await this.blogsRepository.getBlogById(blogId);

    if (!blog) {
      return '';
    }

    return blog.name;
  }

  async getComments(
    bloggerId: string,
    query: QueryParametersDto,
  ): Promise<ContentPageModel> {
    const comment = await this.commentsRepository.getComments(query, bloggerId);
    const viewComment = await Promise.all(
      comment.map((c) => this.addAdditionalInfo(bloggerId, c)),
    );
    const totalCount = await this.commentsRepository.getTotalCount(bloggerId);

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      viewComment,
      totalCount,
    );
  }

  async updatePost(postId: string, dto: PostDto): Promise<boolean> {
    return await this.postsRepository.updatePost(postId, dto);
  }

  async deletePost(postId: string): Promise<boolean> {
    return await this.postsRepository.deletePost(postId);
  }

  private async addAdditionalInfo(
    bloggerId,
    comment: CommentBDModel,
  ): Promise<CommentWithAdditionalInfoModel> {
    const postInfo = await this.postsRepository.getPostById(comment.postId);
    const likesCount = await this.likeRepository.getLikeReactionsCount(
      comment.id,
    );
    const dislikesCount = await this.likeRepository.getDislikeReactionsCount(
      comment.id,
    );
    const status = await this.likeRepository.getUserReaction(
      comment.id,
      bloggerId,
    );

    let myStatus = 'None';
    if (status) {
      myStatus = status.status;
    }

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount,
        dislikesCount,
        myStatus,
      },
      commentatorInfo: {
        userId: comment.userId,
        userLogin: comment.userLogin,
      },
      postInfo: {
        id: postInfo.id,
        title: postInfo.title,
        blogId: postInfo.blogId,
        blogName: postInfo.blogName,
      },
    };
  }
}
