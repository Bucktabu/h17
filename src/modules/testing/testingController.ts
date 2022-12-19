import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogDocument,
} from '../public/blogs/infrastructure/entity/blog.schema';

@Controller('testing')
export class TestingController {
  //constructor(@InjectModel(Blog.name) private blogsRepository: Model<BlogDocument>) {}
  @Delete('all-data')
  @HttpCode(204)
  async deleteAll() {
    await mongoose.connection.db.dropDatabase();
    return HttpStatus.NO_CONTENT;
  }

  // @Delete('all-data')
  // @HttpCode(204)
  // async deleteAll() {
  //   const collections = connection.collections;
  //
  //   for (const key in collections) {
  //     const collection = collections[key];
  //     await collection.deleteMany({});
  //   }
  // }
}
