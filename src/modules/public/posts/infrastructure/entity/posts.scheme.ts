import mongoose, { HydratedDocument } from 'mongoose';
import { PostDBModel } from './post-db.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// const postsScheme = new mongoose.Schema<PostDBModel>({
//   id: { type: String, required: true },
//   title: { type: String, required: true },
//   shortDescription: { type: String, required: true },
//   content: { type: String, required: true },
//   blogId: { type: String, required: true },
//   blogName: { type: String, required: true },
//   createdAt: { type: String, required: true },
//   isBanned: { type: Boolean, default: false }
// });
//
// export const PostsScheme = mongoose.model('posts', postsScheme);

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ String, required: true })
  id: string;

  @Prop({ String, required: true })
  title: string;

  @Prop({ String, required: true })
  shortDescription: string;

  @Prop({ String, required: true })
  content: string;

  @Prop({ String, required: true })
  blogId: string;

  @Prop({ String, required: true })
  blogName: string;

  @Prop({ String, required: true })
  createdAt: string;

  @Prop({ Boolean, default: false })
  isBanned: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
