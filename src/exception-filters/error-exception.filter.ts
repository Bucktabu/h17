import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { settings } from '../settings';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (settings.environment !== 'prod') {
      console.log('ErrorExceptionFilter => !== prod', exception);
      response.status(500).send(exception.toString());
    } else {
      console.log('ErrorExceptionFilter => ', exception);
      response.status(500).send('Some error occurred');
    }
  }
}
