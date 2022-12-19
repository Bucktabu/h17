import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';
import { BlogDBModel } from './entity/blog-db.model';
import { BlogDto } from '../../../blogger/api/dto/blog.dto';
import { BindBlogDto } from '../../../super-admin/api/dto/bind-blog.dto';

export interface IBlogsRepository {
  getBlogs(query: QueryParametersDto, userId?: string): Promise<BlogDBModel[]>;
  getTotalCount(searchNameTerm: string, userId?: string): Promise<number>;
  saGetBlogs(query: QueryParametersDto): Promise<BlogDBModel[]>;
  saGetTotalCount(banStatus: string, searchNameTerm: string): Promise<number>;
  getBlogById(id: string): Promise<BlogDBModel | null>;
  createBlog(newBlog: BlogDBModel): Promise<BlogDBModel | null>;
  bindBlog(params: BindBlogDto): Promise<boolean>;
  updateBlog(id: string, inputModel: BlogDto): Promise<boolean>;
  updateBanStatus(id: string, isBanned: boolean): Promise<boolean>;
  deleteBlog(blogId: string): Promise<boolean>;
}

export const IBlogsRepository = 'IBlogsRepository';
