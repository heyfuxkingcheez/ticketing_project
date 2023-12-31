import { ConflictException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Point } from 'src/point/entities/point.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import { DataSource, Repository } from 'typeorm';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { query } from 'express';

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
  async create(seat: any, id: any, value: any, bodyScheduleId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED'); // 격리 수준

    try {
      // 공연 테이블에서 가격, 등급별 개수 가져오기
      const gradeInfo = await this.performanceRepository.findOne({
        where: { performanceId: value },
      });

      // 스케줄 id
      const schedule: any = await this.scheduleRepository.findOne({
        where: { scheduleId: bodyScheduleId },
        select: ['scheduleId', 'standardLimit', 'royalLimit', 'vipLimit'],
      });

      for (const data of seat) {
        if (
          data.grade === 'STANDARD' &&
          data.seatNum > schedule.standardLimit
        ) {
          throw new Error('좌석 번호를 다시 확인해주세요.');
        } else if (
          data.grade === 'ROYAL' &&
          data.seatNum > schedule.royalLimit
        ) {
          throw new Error('좌석 번호를 다시 확인해주세요.');
        } else if (data.grade === 'VIP' && data.seatNum > schedule.vipLimit) {
          throw new Error('좌석 번호를 다시 확인해주세요.');
        }
      }

      // 1. 예매 테이블 생성
      const createdReservation: any = await queryRunner.manager.save(
        Reservation,
        {
          user: id,
          performance: value,
          schedule: schedule.scheduleId,
        },
      );

      // 2. 좌석 테이블 생성
      let totalPoint = 0;
      for (let i = 0; i < seat.length; i++) {
        // 이미 예약된 좌석인지 확인
        const checkSeat = await queryRunner.query(
          `
          SELECT * FROM seat
          WHERE ScheduleId = ? AND grade = ? AND seatNum = ? 
          `,
          // SQL injection 방지를 위해서 배열로 따로 빼둠
          [schedule.scheduleId, seat[i].grade, seat[i].seatNum],
        );

        if (checkSeat.length !== 0)
          throw new ConflictException('이미 예매된 좌석 입니다.');

        const [limitedSeatCheckawait, count] =
          await queryRunner.manager.findAndCount(Seat, {
            where: {
              schedules: schedule.scheduleId,
              grade: seat[i].grade,
              performance: value,
            },
          });

        // grade별 정해진 좌석수와 예매된 좌석수 비교
        let isWithinLimit = false;
        let finalPrice = 0;
        if (seat[i].grade === 'STANDARD' && count < schedule.standardLimit) {
          isWithinLimit = true;
          finalPrice = gradeInfo.price;
        } else if (seat[i].grade === 'ROYAL' && count < schedule.royalLimit) {
          isWithinLimit = true;
          finalPrice = gradeInfo.price * 1.5;
        } else if (seat[i].grade === 'VIP' && count < schedule.vipLimit) {
          isWithinLimit = true;
          finalPrice = gradeInfo.price * 1.75;
        }
        // 좌석 저장
        if (isWithinLimit) {
          await queryRunner.manager.save(Seat, {
            performance: value,
            user: id,
            reservation: createdReservation.reservationId,
            schedules: schedule.scheduleId,
            grade: seat[i].grade,
            seatNum: seat[i].seatNum,
            seatPrice: finalPrice,
          });
          totalPoint += finalPrice;
        } else {
          throw new Error();
        }
      }
      // 3. 포인트 결제

      const lastPoint = await queryRunner.manager.find(Point, {
        where: { user: id },
        order: { createdAt: 'DESC' },
        take: 1,
      });

      // 포인트 상태 변경
      if (lastPoint[0].balance < totalPoint) {
        throw new Error('잔액 부족');
      }
      await queryRunner.manager.save(Point, {
        UserId: id,
        reservation: createdReservation.reservationId,
        income: 0,
        expense: totalPoint,
        balance: lastPoint[0].balance - totalPoint,
      });

      // 동시성 처리를 위해서 예매가 된 좌석인지 체크
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
  async findAll(user: any) {
    const reservationByUser = await this.reservationRepository.find({
      where: { user: user.userId },
      order: { createdAt: 'DESC' },
      relations: ['performance'],
    });
    return { reservationByUser };
  }

  // 예매 취소
  async remove(value: number, user: any) {
    const jwtUserId = user.userId;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // 격리 수준

    try {
      // 3시간 전 인지 확인 logic
      const getStartTime = await queryRunner.manager.findOne(Reservation, {
        where: { reservationId: value },
        relations: ['schedule'],
      });
      const startTime = getStartTime.schedule.startTime;
      const timeCheck = await queryRunner.query(
        `
        SELECT *
        FROM schedule
        WHERE TIMEDIFF(?, ?) < ?;
        `,
        // SQL injection 방지를 위해서 배열로 따로 빼둠
        [new Date(), startTime, '03:00:00'],
      );
      if (timeCheck.length === 0) {
        console.log('유효기간 지남');
        throw new Error();
      }

      //---------------------<Seat logic>------------------------
      // 취소하고자 하는 좌석 컬럼 삭제
      await queryRunner.manager.delete(Seat, { reservation: value });

      //-------------------<Reservation logic>-------------------
      await queryRunner.manager.update(
        Reservation,
        { reservationId: value },
        { status: false },
      );
      //---------------------<Point logic>-----------------------
      // 현재 잔고를 가져옴
      const currentUserPointTable = await queryRunner.manager.find(Point, {
        where: { UserId: jwtUserId },
        order: { createdAt: 'DESC' },
        take: 1,
      });
      const currentUserBalance = currentUserPointTable[0].balance;

      // 취소할 거래 내역을 가져옴
      const refundedPoint = await queryRunner.manager.findOne(Point, {
        where: { reservation: { reservationId: value } },
      });
      const refundedPointValue = refundedPoint.expense;

      // 환불 컬럼을 생성
      // reservation 테이블의 status(예매상태)를 가져옴
      const reservationStatus = await queryRunner.manager.findOne(Reservation, {
        where: { reservationId: value },
        select: ['status'],
      });
      // 예매 상태가 false(예매취소)일 때
      if (reservationStatus.status) {
        throw new Error();
      }
      // 포인트 환불 컬럼 로직 실행
      await queryRunner.manager.save(Point, {
        UserId: jwtUserId,
        reservation: { reservationId: value },
        income: refundedPoint.expense,
        expense: 0,
        balance: currentUserBalance + refundedPointValue,
      });
      await queryRunner.commitTransaction();
      return { status: 201, message: 'Reservation refund success' };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return { status: 500, message: 'Reservation refund failed' };
    } finally {
      await queryRunner.release();
    }
  }
}
