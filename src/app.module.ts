import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BloggerBlogsController } from './modules/blogger/api/blogger-blogs.controller';
import { BloggerPostService } from './modules/blogger/application/posts.service';
import { BloggerBlogService } from './modules/blogger/application/blogs.service';
import { BanInfoRepository } from './modules/super-admin/infrastructure/ban-info/banInfo.repository';
import { EmailConfirmationRepository } from './modules/super-admin/infrastructure/email-confirmation/email-confirmation.repository';
import { SaBlogsController } from './modules/super-admin/api/sa-blogs.controller';
import { SaBlogsService } from './modules/super-admin/application/sa-blogs-service';
import { UsersController } from './modules/super-admin/api/users.controller';
import { UsersService } from './modules/super-admin/application/users.service';
import { UsersRepository } from './modules/super-admin/infrastructure/users/users.repository';
import { JwtRepository } from './modules/public/auth/infrastructure/jwt.repository';
import { JwtService } from './modules/public/auth/application/jwt.service';
import { AuthController } from './modules/public/auth/api/auth.controller';
import { BlogsController } from './modules/public/blogs/api/blogs.controller';
import { CommentsController } from './modules/public/comments/api/comments.controller';
import { PostsController } from './modules/public/posts/api/posts.controller';
import { SecurityController } from './modules/public/security/api/security.controller';
import { TestingController } from './modules/testing/testingController';
import { AuthService } from './modules/public/auth/application/auth.service';
import { EmailConfirmationService } from './modules/super-admin/application/emailConfirmation.service';
import { CommentsService } from './modules/public/comments/application/comments.service';
import { EmailAdapters } from './modules/public/auth/email-transfer/email.adapter';
import { EmailManager } from './modules/public/auth/email-transfer/email.manager';
import { LikesService } from './modules/public/likes/application/likes.service';
import { PostsService } from './modules/public/posts/application/posts.service';
import { SecurityService } from './modules/public/security/application/security.service';
import { BlogsService } from './modules/public/blogs/application/blogs.service';
import { BlogsRepository } from './modules/public/blogs/infrastructure/blogs.repository';
import { CommentsRepository } from './modules/public/comments/infrastructure/comments.repository';
import { LikesRepository } from './modules/public/likes/infrastructure/likes.repository';
import { PostsRepository } from './modules/public/posts/infrastructure/posts.repository';
import { SecurityRepository } from './modules/public/security/infrastructure/security.repository';
import { EmailExistValidator } from './validation/email-exist-validator.service';
import { EmailResendingValidationPipe } from './pipe/email-resending.pipe';
import { LoginExistValidator } from './validation/login-exist-validator.service';
import { BlogExistValidator } from './validation/blog-exist.validator';
import { ConfirmationCodeValidator } from './validation/confirmation-code.validator';
import { CreateUserUseCase } from './modules/super-admin/use-cases/create-user.use-case';
import { IJwtRepository } from './modules/public/auth/infrastructure/jwt-repository.interface';
import { IBlogsRepository } from './modules/public/blogs/infrastructure/blogs-repository.interface';
import { ICommentsRepository } from './modules/public/comments/infrastructure/comments-repository.interface';
import { ILikesRepository } from './modules/public/likes/infrastructure/likes-repository.interface';
import { IPostsRepository } from './modules/public/posts/infrastructure/posts-repository.interface';
import { ISecurityRepository } from './modules/public/security/infrastructure/security-repository.interface';
import { IBanInfo } from './modules/super-admin/infrastructure/ban-info/ban-info.interface';
import { IEmailConfirmation } from './modules/super-admin/infrastructure/email-confirmation/email-confirmation.interface';
import { IUsersRepository } from './modules/super-admin/infrastructure/users/users-repository.interface';
import { BloggerUsersController } from './modules/blogger/api/blogger-users.controller';
import {
  TokenBlackList,
  TokenBlackListSchema,
} from './modules/public/auth/infrastructure/entity/tokenBlackList.scheme';
import {
  Blog,
  BlogSchema,
} from './modules/public/blogs/infrastructure/entity/blog.schema';
import {
  Comment,
  CommentSchema,
} from './modules/public/comments/infrastructure/entity/comments.scheme';
import {
  Post,
  PostSchema,
} from './modules/public/posts/infrastructure/entity/posts.scheme';
import {
  Like,
  LikeSchema,
} from './modules/public/likes/infrastructure/entity/likes.scheme';
import {
  Security,
  SecuritySchema,
} from './modules/public/security/infrastructure/entity/security.scheme';
import {
  BanInfo,
  BanInfoSchema,
} from './modules/super-admin/infrastructure/entity/banInfo.scheme';
import {
  User,
  UserScheme,
} from './modules/super-admin/infrastructure/entity/users.scheme';
import {
  UserDevice,
  UserDeviceSchema,
} from './modules/public/security/infrastructure/entity/user-device.scheme';
import {
  EmailConfirmation,
  EmailConfirmationSchema,
} from './modules/super-admin/infrastructure/entity/emailConfirm.scheme';
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from '@nestjs/typeorm';
import { settings } from "./settings";

const controllers = [
  BloggerBlogsController,
  BloggerUsersController,
  SaBlogsController,
  AuthController,
  BlogsController,
  CommentsController,
  PostsController,
  SecurityController,
  TestingController,
  UsersController,
];

const pipes = [
  EmailExistValidator,
  EmailResendingValidationPipe,
  LoginExistValidator,
];

const repositories = [
  { provide: IBanInfo, useClass: BanInfoRepository },
  { provide: IBlogsRepository, useClass: BlogsRepository },
  { provide: ICommentsRepository, useClass: CommentsRepository },
  { provide: IEmailConfirmation, useClass: EmailConfirmationRepository },
  { provide: IJwtRepository, useClass: JwtRepository },
  { provide: ILikesRepository, useClass: LikesRepository },
  { provide: IPostsRepository, useClass: PostsRepository },
  { provide: ISecurityRepository, useClass: SecurityRepository },
  { provide: IUsersRepository, useClass: UsersRepository },
];

const services = [
  BloggerBlogService,
  BloggerPostService,
  AuthService,
  BlogsService,
  CommentsService,
  EmailAdapters,
  EmailManager,
  EmailConfirmationService,
  JwtService,
  LikesService,
  PostsService,
  SecurityService,
  SaBlogsService,
  UsersService,
];

const schemes = [
  { name: BanInfo.name, schema: BanInfoSchema },
  { name: Blog.name, schema: BlogSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: EmailConfirmation.name, schema: EmailConfirmationSchema },
  { name: Like.name, schema: LikeSchema },
  { name: Post.name, schema: PostSchema },
  { name: Security.name, schema: SecuritySchema },
  { name: TokenBlackList.name, schema: TokenBlackListSchema },
  { name: User.name, schema: UserScheme },
  { name: UserDevice.name, schema: UserDeviceSchema },
];

const validators = [BlogExistValidator, ConfirmationCodeValidator];

const useCases = [CreateUserUseCase];

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature(schemes),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://rURFwkhmLDRjHIePuNOdHnTdJTjXlbpO:CMtybUiSFxGdvOFhjSVrPwHamxtGkvbz@db.thin.dev/07b2d355-46be-470b-907d-ff41cefe3813'
      // host: 'localhost',
      // port: Number(settings.postgres.PORT),
      // username: settings.postgres.USERNAME,
      // password: settings.postgres.PASSWORD,
      // database: settings.postgres.DATABASE_NAME,
      // //autoLoadEntities: true, // ./src/modules/*/infr/entity/**.ts
      // entities: [], // TODO нужно ли сюда прописывать все ентити
      // synchronize: false,
    }),
    //ThrottlerModule.forRoot({ ttl: Number(settings.throttler.CONNECTION_TIME_LIMIT), limit: Number(settings.throttler.CONNECTION_COUNT_LIMIT) }),
  ],
  controllers: [...controllers],
  providers: [
    ...pipes,
    ...repositories,
    ...services,
    ...validators,
    ...useCases,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {}
}
