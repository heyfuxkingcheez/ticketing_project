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

    console.log('서비스 seat: ', seat);
    console.log('서비스 유저 id: ', id);
    console.log('서비스 퍼포먼스 id: ', value);
    console.log('서비스 스케줄 id: ', bodyScheduleId);
    try {
      // 공연 테이블에서 가격, 등급별 개수 가져오기
      const gradeInfo = await this.performanceRepository.findOne({
        where: { performanceId: value },
      });
      console.log('공연 가격 ===>', gradeInfo.price);

      // 스케줄 id
      const schedule: any = await this.scheduleRepository.findOne({
        where: { scheduleId: bodyScheduleId },
        select: ['scheduleId', 'standardLimit', 'royalLimit', 'vipLimit'],
      });
      console.log('스케줄아이디, 등급별 리밋 수 ==>', schedule);

      // 1. 예매 테이블 생성
      const createdReservation: any = await queryRunner.manager.save(
        Reservation,
        {
          user: id,
          performance: value,
          schedule: schedule.scheduleId,
        },
      );
      console.log('예매 table ===> ', createdReservation);

      // 2. 좌석 테이블 생성
      let totalPoint = 0;
      for (let i = 0; i < seat.length; i++) {
        console.log(`반복문 돌리는 중 ${i} 번째 =>`, seat[i].grade);
        console.log(`반복문 돌리는 중 ${i} 번째 =>`, seat[i].seatNum);

        // 이미 예약된 좌석인지 확인
        const checkSeat = await queryRunner.query(
          `
          SELECT * FROM seat
          WHERE ScheduleId = ? AND grade = ? AND seatNum = ? 
          `,
          // SQL injection 방지를 위해서 배열로 따로 빼둠
          [schedule.scheduleId, seat[i].grade, seat[i].seatNum],
        );
        console.log('이미 예약된 좌석인지 확인 ===>', checkSeat);
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
        console.log('현재 예약 완료된 좌석 수 ===>', count);

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
        console.log(`반복문 ${i}번 끝`);
      }
      // 3. 포인트 결제
      console.log('구매한 공연 좌석 총 가격 ===>', totalPoint);
      const lastPoint = await queryRunner.manager.find(Point, {
        where: { user: id },
        order: { createdAt: 'DESC' },
        take: 1,
      });
      console.log('로그인 한 유저의 포인트 잔고', lastPoint[0].balance);

      // 포인트 상태 변경
      await queryRunner.manager.save(Point, {
        UserId: id,
        reservation: createdReservation.reservationId,
        income: 0,
        expense: totalPoint,
        balance: lastPoint[0].balance - totalPoint,
      });

      // // 동시성 처리를 위해서 예매가 된 좌석인지 체크
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
  async remove(value: number, user: any) {
    const jwtUserId = user.userId;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED'); // 격리 수준

    console.log('유저 ID ===>', jwtUserId);
    console.log('예매 ID ===>', value);
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
      console.log('현재 잔고', currentUserBalance);

      // 취소할 거래 내역을 가져옴
      const refundedPoint = await queryRunner.manager.findOne(Point, {
        where: { reservation: { reservationId: value } },
      });
      const refundedPointValue = refundedPoint.expense;
      console.log('환불할 가격', refundedPointValue);

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
