import { IsEmail } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class EmailDTO {
  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string;
}
