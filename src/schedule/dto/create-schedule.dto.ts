import { instanceToInstance } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty({ message: '공연 시작 시각을 입력해주세요.' })
  startTime: string;

  @IsNotEmpty({ message: '공연 종료 시각을 입력해주세요.' })
  endTime: string;

  @IsNotEmpty({ message: 'STANDARD석 좌석수를 입력해주세요.' })
  standardLimit: number;

  @IsNotEmpty({ message: 'ROYAL석 좌석수를 입력해주세요.' })
  royalLimit: number;

  @IsNotEmpty({ message: 'VIP석 좌석수를 입력해주세요.' })
  vipLimit: number;
}
