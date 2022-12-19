import mongoose, { HydratedDocument } from 'mongoose';
import { BlogDBModel } from './blog-db.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// const blogScheme = new mongoose.Schema<BlogDBModel>({
//   id: { type: String, required: true },
//   userId: { type: String },
//   name: { type: String, required: true },
//   websiteUrl: { type: String, required: true },
//   description: { type: String, required: true },
//   createdAt: { type: String, required: true },
//   isBanned: { type: Boolean, default: false },
// });
//
// export const BlogSchema = mongoose.model('blogs', blogScheme);

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ String, required: true })
  id: string;

  @Prop({ String, required: true })
  userId: string;

  @Prop({ String, required: true })
  name: string;

  @Prop({ String, required: true })
  websiteUrl: string;

  @Prop({ String, required: true })
  description: string;

  @Prop({ String, required: true })
  createdAt: string;

  @Prop({ Boolean, default: false })
  isBanned: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
