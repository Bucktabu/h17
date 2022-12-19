import { LikesModel } from './entity/likes.model';
import { NewestLikesModel } from './entity/newestLikes.model';

export interface ILikesRepository {
  getUserReaction(parentId: string, userId: string): Promise<LikesModel | null>;
  getNewestLikes(parentId: string): Promise<NewestLikesModel[] | null>;
  getLikeReactionsCount(parentId: string): Promise<number>;
  getDislikeReactionsCount(parentId: string): Promise<number>;
  updateUserReaction(
    commentId: string,
    userId: string,
    status: string,
    addedAt: string,
    login?: string,
  ): Promise<boolean>;
  updateBanStatus(userId: string, isBanned: boolean): Promise<boolean>;
}

export const ILikesRepository = 'ILikesRepository';
