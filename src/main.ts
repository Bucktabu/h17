import { NestFactory } from '@nestjs/core';
import { runDB } from './db';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

import cookieParser from 'cookie-parser';
import { ErrorExceptionFilter } from './exception-filters/error-exception.filter';
import { HttpExceptionFilter } from './exception-filters/exception.filter';
import { useContainer } from 'class-validator';

const port = process.env.PORT || 5000;

async function bootstrap() {
  await runDB();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalFilters(new ErrorExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,

      exceptionFactory: (errorsMessages) => {
        const errorsForResponse = [];

        errorsMessages.forEach((e) => {
          const keys = Object.keys(e.constraints);
          errorsForResponse.push({
            message: e.constraints[keys[0]],
            field: e.property,
          });
        });

        throw new BadRequestException(
          errorsForResponse,
          //errorsMessages.map((e) => e.constraints),
        );
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

bootstrap();
