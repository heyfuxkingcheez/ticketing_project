import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Grade } from 'src/user/types/grade.type';

export class CreateSeatDto {}

export class SeatDto {
  @IsNotEmpty({ message: '좌석 등급을 선택 해주세요.' })
  @ApiProperty({
    example: 'VIP',
    description: '좌석 등급',
    required: true,
  })
  grade: string;

  @IsNotEmpty({ message: '좌석을 선택 해주세요.' })
  @ApiProperty({
    example: 12,
    description: '좌석 번호',
    required: true,
  })
  seatNum: number;
}

export class SetSeatDto {
  @IsNotEmpty({ message: '좌석 정보를 입력해주세요.' })
  @IsArray()
  seats: { grade: Grade; seatNum: number }[];
}
