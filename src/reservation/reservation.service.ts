import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Point } from 'src/point/entities/point.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationService {
  constructor(
    // Reservation, Schedule, Performance, Point, Seat
    @InjectRepository(Reservation)
    private reservationRepositor: Repository<Reservation>,

    @InjectRepository(Schedule)
    private readonly scheduleRepositor: Repository<Schedule>,

    @InjectRepository(Performance)
    private readonly performanceRepositor: Repository<Performance>,

    @InjectRepository(Point)
    private pointRepositor: Repository<Point>,

    @InjectRepository(Seat)
    private seatRepositor: Repository<Seat>,
  ) {}

  // 공연 예매
  create(createReservationDto: CreateReservationDto) {
    return 'This action adds a new reservation';
  }
  // 예매 목록 조회
  findAll() {
    return `This action returns all reservation`;
  }
  // 예매 상세 조회
  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }
  // 예매 취소
  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
