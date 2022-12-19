import mongoose, { HydratedDocument } from 'mongoose';
import { LikesModel } from './likes.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// const likesScheme = new mongoose.Schema<LikesModel>({
//   parentId: { type: String, required: true },
//   userId: { type: String, required: true },
//   status: { type: String, required: true },
//   addedAt: { type: String, required: true },
//   login: { type: String, required: true },
//   isBanned: { type: Boolean, default: false },
// });
//
// export const LikesScheme = mongoose.model('likes', likesScheme);

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({ String, required: true })
  parentId: string;

  @Prop({ String, required: true })
  userId: string;

  @Prop({ String, required: true })
  status: string;

  @Prop({ String, required: true })
  addedAt: string;

  @Prop({ String, required: true })
  login: string;

  @Prop({ Boolean, default: false })
  isBanned: boolean;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
