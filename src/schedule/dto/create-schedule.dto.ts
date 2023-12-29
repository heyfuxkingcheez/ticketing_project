import { IsNotEmpty } from 'class-validator';
import { StringNullableChain } from 'lodash';

export class CreateScheduleDto {
  @IsNotEmpty({ message: '공연 시작 시각을 입력해주세요.' })
  startTime: string;

  @IsNotEmpty({ message: '공연 종료 시각을 입력해주세요.' })
  endTime: string;
}
