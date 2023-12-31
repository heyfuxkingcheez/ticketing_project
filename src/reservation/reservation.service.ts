import { ConflictException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Point } from 'src/point/entities/point.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ReservationService {
  constructor(
    // Reservation, Schedule, Performance, Point, Seat
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,

    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,

    @InjectRepository(Point)
    private pointRepository: Repository<Point>,

    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,

    private dataSource: DataSource,
  ) {}

  // 공연 예매
  async create(seat: any, id: unknown, value: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    console.log('서비스 seat: ', seat);
    console.log('서비스 유저id: ', id);
    console.log('서비스 퍼포먼스value: ', value);
    try {
      // 공연 테이블에서 가격, 등급별 개수 가져오기
      const gradeInfo = await this.performanceRepository.findOne({
        where: { performanceId: value },
        select: ['price', 'standardLimit', 'royalLimit', 'vipLimit'],
      });
      console.log('공연 테이블에서 가져온 등급별 리밋 ===>', gradeInfo);

      // 스케줄 id
      const schedule = await this.scheduleRepository.findOne({
        where: { performance: value },
        select: ['scheduleId'],
      });
      console.log('스케줄 id ==>', schedule.scheduleId);

      // 1. 예매 테이블 생성
      const createdReservation: any = await this.reservationRepository.save({
        user: id,
        performance: value,
        schedule,
      });
      console.log('예매 table ===> ', createdReservation);

      // 2. 좌석 테이블 생성
      for (let i = 0; i < seat.length; i++) {
        console.log(`반복문 돌리는 중 ${i} 번째 =>`, seat[i].grade);
        console.log(`반복문 돌리는 중 ${i} 번째 =>`, seat[i].seatNum);

        // 이미 예약된 좌석인지 확인
        const checkSeat = await queryRunner.query(
          `
          SELECT * FROM seat
          WHERE PerformanceId = ? AND grade = ? AND seatNum = ?  
          `,
          // SQL injection 방지를 위해서 배열로 따로 빼둠
          [value, seat[i].grade, seat[i].seatNum],
        );

        if (checkSeat.length !== 0)
          throw new ConflictException('이미 예매된 좌석 입니다.');

        const [limitedSeatCheckawait, count] =
          await this.seatRepository.findAndCount({
            where: {
              grade: seat[i].grade,
              performance: value,
            },
          });
        console.log('현재 예약 완료된 좌석 수 ===>', count);

        // grade별 정해진 좌석수와 예매된 좌석수 비교
        let isWithinLimit = false;
        let finalPrice = 0;
        if (seat[i].grade === '0' && count < gradeInfo.standardLimit) {
          isWithinLimit = true;
          finalPrice = gradeInfo.price;
        } else if (seat[i].grade === '1' && count < gradeInfo.royalLimit) {
          isWithinLimit = true;
          finalPrice = gradeInfo.price * 1.5;
        } else if (seat[i].grade === '2' && count < gradeInfo.vipLimit) {
          isWithinLimit = true;
          finalPrice = gradeInfo.price * 1.75;
        }
        // 좌석 저장
        if (isWithinLimit) {
          await this.seatRepository.save({
            performance: value,
            user: id,
            reservation: createdReservation.reservationId,
            grade: seat[i].grade,
            seatNum: seat[i].seatNum,
            seatPrice: finalPrice,
          });
        } else {
          throw new Error();
        }
        console.log(`반복문 ${i}번 끝`);
      }
      await queryRunner.commitTransaction();
      return { status: 201, message: 'Reservation successful' };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return { status: 500, message: 'Reservation failed' };
    } finally {
      await queryRunner.release();
    }
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
