import { IsNotEmpty } from 'class-validator';

export class CreatePlaceDto {
  @IsNotEmpty({ message: '장소를 입력해주세요' })
  place: string;

  @IsNotEmpty({ message: '공연 ID를 입력해주세요.' })
  PerformanceId: number;
}
