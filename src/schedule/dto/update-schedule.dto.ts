import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateScheduleDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  standardLimit?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  royalLimit?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  vipLimit?: number;
}
