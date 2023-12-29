import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { isString } from 'lodash';
import { Category } from 'src/user/types/performance.type';

export class UpdatePerformanceDto {
  @IsOptional()
  @IsString()
  performanceTitle?: string;

  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  place?: string;

  @IsOptional()
  @IsNumber()
  hours?: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
