import { UserViewModel } from '../modules/super-admin/api/dto/userView.model';
import { BlogViewModel } from '../modules/public/blogs/api/dto/blogView.model';
import { PostViewModel } from '../modules/public/posts/api/dto/postsView.model';
import { CommentViewModel } from '../modules/public/comments/api/dto/commentView.model';
import { BlogViewWithOwnerAndBanInfo } from '../modules/super-admin/api/dto/blog-view-with-owner-and-ban.info';
import { ViewBanInfoModel } from '../modules/blogger/api/dto/view-ban-info.model';
import { CommentWithAdditionalInfoModel } from '../modules/blogger/api/dto/comment-with-additional-info.model';

export class ContentPageModel {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items:
      | BlogViewModel[]
      | BlogViewWithOwnerAndBanInfo[]
      | CommentWithAdditionalInfoModel[]
      | PostViewModel[]
      | UserViewModel[]
      | CommentViewModel[]
      | ViewBanInfoModel[],
  ) {}
}
