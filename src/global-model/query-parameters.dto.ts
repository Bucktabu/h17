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
      case 'youtubeUrl': return value = SortParametersModel.YoutubeUrl;
      case 'blogId': return value = SortParametersModel.BlogId;
      case 'createdAt': return value = SortParametersModel.CreatedAt;
      default: return value;
    }
  })
  sortBy: string = SortParametersModel.CreatedAt;

  @IsEnum(SortDirections)
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return
    switch (value) {
      case 'asc': return value = SortDirections.Ascending;
      case 'desc': return value = SortDirections.Distending
      default: return value;
    }
  })
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
