import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Grade } from 'src/user/types/grade.type';

export class CreateSeatDto {}

export class SeatDto {
  @IsNotEmpty({ message: '좌석 등급을 선택 해주세요.' })
  grade: string;

  @IsNotEmpty({ message: '좌석을 선택 해주세요.' })
  seatNum: number;
}

export class SetSeatDto {
  @IsNotEmpty({ message: '좌석 정보를 입력해주세요.' })
  @IsArray()
  seats: { grade: Grade; seatNum: number }[];
}
