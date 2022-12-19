import { IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class AuthDTO {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  loginOrEmail: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
}
