import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';
import { CommentBDModel } from './entity/commentDB.model';

export interface ICommentsRepository {
  getComments(
    query: QueryParametersDto,
    postId: string,
  ): Promise<CommentBDModel[]>;
  getTotalCount(postId: string): Promise<number>;
  getCommentById(commentId: string): Promise<CommentBDModel | null>;
  createComment(newComment: CommentBDModel): Promise<CommentBDModel | null>;
  updateComment(commentId: string, comment: string): Promise<boolean>;
  deleteCommentById(commentId: string): Promise<boolean>;
}

export const ICommentsRepository = 'ICommentsRepository';
