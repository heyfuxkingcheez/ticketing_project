import { IsNumber, IsOptional, IsString } from 'class-validator';
import { isString } from 'lodash';

export class UpdatePerformanceDto {
  @IsOptional()
  @IsString()
  performanceTitle?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  image?: string;
}
