import { IsEnum, IsNotEmpty } from 'class-validator';
import { Category } from 'src/user/types/performance.type';

export class CreatePerformanceDto {
  @IsNotEmpty({ message: '공연 이름을 입력해주세요.' })
  performanceTitle: string;

  @IsEnum(Category)
  category: Category;

  @IsNotEmpty({ message: '관람연령을 입력해주세요.' })
  age: number;

  @IsNotEmpty({ message: '공연 가격을 입력해주세요.' })
  price: number;

  @IsNotEmpty({ message: '이미지 주소를 입력해주세요' })
  imageUrl: string;

  @IsNotEmpty({ message: '관람 시간을 입력해주세요' })
  hours: number;

  @IsNotEmpty({ message: '장소를 입력해주세요' })
  place: string;

  @IsNotEmpty({ message: '시작일을 입력해주세요.' })
  startDate: string;

  @IsNotEmpty({ message: '종료일을 입력해주세요.' })
  endDate: string;
}
