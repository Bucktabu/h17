import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';
import { PostDBModel } from './entity/post-db.model';
import { PostDto } from '../../../blogger/api/dto/post.dto';

export interface IPostsRepository {
  getPosts(
    query: QueryParametersDto,
    blogId: string | undefined,
  ): Promise<PostDBModel[]>;
  getTotalCount(blogId: string | undefined): Promise<number>;
  getPostById(id: string): Promise<PostDBModel | null>;
  createPost(newPost: PostDBModel): Promise<PostDBModel | null>;
  updatePost(postId: string, dto: PostDto): Promise<boolean>;
  updatePostsBanStatus(blogId: string, isBanned: boolean): Promise<boolean>;
  deletePost(postId: string): Promise<boolean>;
}

export const IPostsRepository = 'IPostsRepository';
