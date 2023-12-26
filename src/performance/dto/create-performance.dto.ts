import { IsNotEmpty } from 'class-validator';

export class CreatePerformanceDto {
  @IsNotEmpty({ message: '공연 이름을 입력해주세요.' })
  performanceTitle: string;

  @IsNotEmpty({ message: '공연 시작 시각을 입력해주세요.' })
  startTime: string;

  @IsNotEmpty({ message: '공연 시작 시각을 입력해주세요.' })
  endTime: string;

  @IsNotEmpty({ message: '관람연령을 입력해주세요.' })
  age: number;

  @IsNotEmpty({ message: '공연 가격을 입력해주세요.' })
  price: number;

  @IsNotEmpty({ message: '이미지 주소를 입력해주세요' })
  image: string;
}
