import { IsNotEmpty } from 'class-validator';

export class CreateReservationDto {}

export class SeatDto {
  @IsNotEmpty({ message: '좌석 등급을 선택 해주세요.' })
  grade: string;

  @IsNotEmpty({ message: '좌석을 선택 해주세요.' })
  seatNum: number;
}

export class SetSeatDto {
  seats: SeatDto[];

  @IsNotEmpty({ message: '공연을 선택 해주세요.' })
  scheduleId: number;
}
