import mongoose, { HydratedDocument } from 'mongoose';
import { CommentBDModel } from './commentDB.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// const commentsScheme = new mongoose.Schema<CommentBDModel>({
//   id: { type: String, required: true },
//   content: { type: String, required: true },
//   userId: { type: String, required: true },
//   userLogin: { type: String, required: true },
//   createdAt: { type: String, required: true },
//   bloggerId: { type: String, required: true },
//   postId: { type: String, required: true },
// });
//
// export const CommentsSchema = mongoose.model('comment', commentsScheme);

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userLogin: string;

  @Prop({ type: String, required: true })
  createdAt: string;

  @Prop({ type: String, required: true })
  bloggerId: string;

  @Prop({ type: String, required: true })
  postId: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
