import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';
import { SortDirections, SortParametersModel } from './sort-parameters.model';
import { BanStatusModel } from './ban-status.model';

export class QueryParametersDto {
  @IsEnum(BanStatusModel)
  @IsOptional()
  banStatus: string = BanStatusModel.All;

  @IsEnum(SortParametersModel)
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return
    switch (value) {
      case 'youtubeUrl': return value = 'youtube_url';
      case 'blogId': return value = 'blog_id'
      case 'createdAt': return value = 'created_at'
      default: return value;
    }
  })
  sortBy: string = 'created_at';

  @IsEnum(SortDirections)
  @IsOptional()
  sortDirection: string = SortDirections.Distending;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  pageNumber = 1;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  pageSize = 10;

  @IsString()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsOptional()
  searchNameTerm = '';

  @IsString()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsOptional()
  searchLoginTerm = '';

  @IsString()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsOptional()
  searchEmailTerm = '';
}
