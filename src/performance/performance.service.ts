import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { Performance } from './entities/performance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { CreateScheduleDto } from 'src/schedule/dto/create-schedule.dto';
import { UpdateScheduleDto } from 'src/schedule/dto/update-schedule.dto';
import { Seat } from 'src/seat/entities/seat.entity';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    private dataSource: DataSource,
  ) {}

  // 공연 등록
  async create(
    createPerformanceDto: CreatePerformanceDto,
    createScheduleDto: CreateScheduleDto,
    playDate: any,
  ) {
    // Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // performance 테이블 작성
    try {
      const post = await this.performanceRepository.save(createPerformanceDto);
      const id: any = post.performanceId;

      // schedule 테이블 작성
      const { startTime, endTime, standardLimit, royalLimit, vipLimit } =
        createScheduleDto;
      await this.scheduleRepository.save({
        performance: id,
        startTime: `${playDate.playDate} ${startTime}`,
        endTime: `${playDate.playDate} ${startTime}`,
        standardLimit,
        royalLimit,
        vipLimit,
      });
      await queryRunner.commitTransaction();
      return { post };
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // 공연 전체 조회
  async findAll() {
    const performances = await this.performanceRepository.find();

    return { performances };
  }

  // 공연 상세 조회
  async findOne(performanceId: number) {
    const performance = await this.performanceRepository
      .createQueryBuilder('performance')
      .leftJoinAndSelect('performance.schedules', 'schedule')
      .where({ performanceId })
      .getOne();

    return { performance };
  }

  // 해당 공연 특정 시간대 좌석 조회
  async findOneSeats(performanceId: number, user: any, scheduleId: any) {
    console.log('user: ', user);
    console.log('scheduleId: ', scheduleId);

    const performance = await this.performanceRepository
      .createQueryBuilder('performance')
      .leftJoinAndSelect('performance.schedules', 'schedule')
      .where({ performanceId })
      .getOne();
    console.log('performance', performance);

    const limits = await this.scheduleRepository.findOne({
      where: { scheduleId },
      select: ['standardLimit', 'royalLimit', 'vipLimit'],
    });
    console.log('limits: ', limits);

    const existSeats = await this.seatRepository.find({
      where: { schedules: scheduleId },
    });
    console.log('existSeats: ', existSeats);

    //-----------------------------------------------------------------------

    // 예매된 좌석 배열 초기화
    let bookedStandardSeatArr: Array<number> = [];
    let bookedRoyalSeatArr: Array<number> = [];
    let bookedVipSeatArr: Array<number> = [];

    // 좌석db에 존재하는 seatNum을 각 grade에 맞게 새로운 배열로 반환
    for (const existseat of existSeats) {
      if (existseat.grade === 'STANDARD') {
        bookedStandardSeatArr.push(existseat.seatNum);
      } else if (existseat.grade === 'ROYAL') {
        bookedRoyalSeatArr.push(existseat.seatNum);
      } else if (existseat.grade === 'VIP') {
        bookedVipSeatArr.push(existseat.seatNum);
      }
    }
    console.log('스탠다드 예매된 좌석 Arr', bookedStandardSeatArr);
    console.log('로얄 예매된 좌석 Arr', bookedRoyalSeatArr);
    console.log('뷔아피 예매된 좌석 Arr', bookedVipSeatArr);

    // 예매 가능한 좌석 배열 초기화
    let possibleStandard: Array<any> = [];
    let possibleRoyal: Array<any> = [];
    let possibleVip: Array<any> = [];

    // 예매 가능 좌석 생성 class
    class SeatObject {
      grade: string;
      seatNum: number;
      price: number;

      constructor(grade: string, seatNum: number, price: number) {
        this.grade = grade;
        this.seatNum = seatNum;
        this.price = price;
      }
    }
    // STANDARD 예매 가능 좌석 생성
    for (let i = 1; i <= limits.standardLimit; i++) {
      const standard = new SeatObject('STANDARD', i, performance.price);
      possibleStandard.push(standard);
    }
    const filteredStandardSeats = possibleStandard.filter(
      (seat) => !bookedStandardSeatArr.includes(seat.seatNum),
    );
    // ROYAL 예매 가능 좌석 생성
    for (let i = 1; i <= limits.royalLimit; i++) {
      const royal = new SeatObject('ROYAL', i, performance.price * 1.5);
      possibleRoyal.push(royal);
    }
    const filteredRoyalSeats = possibleRoyal.filter(
      (seat) => !bookedRoyalSeatArr.includes(seat.seatNum),
    );
    // VIP 예매 가능 좌석 생성
    for (let i = 1; i <= limits.vipLimit; i++) {
      const vip = new SeatObject('VIP', i, performance.price * 1.75);
      possibleVip.push(vip);
    }
    const filteredVipSeats = possibleVip.filter(
      (seat) => !bookedVipSeatArr.includes(seat.seatNum),
    );

    console.log('스탠다드 예매 가능 좌석', filteredStandardSeats);
    console.log('로얄 예매 가능 좌석', filteredRoyalSeats);
    console.log('뷔아피 예매 가능 좌석', filteredVipSeats);

    return { filteredStandardSeats, filteredRoyalSeats, filteredVipSeats };
  }

  // 공연 수정
  async update(
    performanceId: number,
    updatePerformanceDto: UpdatePerformanceDto,
  ) {
    const existperformance = await this.performanceRepository.findOne({
      where: { performanceId },
    });

    if (!existperformance) {
      throw new NotFoundException('존재하지 않은 데이터입니다.');
    }

    const updatePerformance = await this.performanceRepository.update(
      performanceId,
      updatePerformanceDto,
    );
    return { updatePerformance };
  }

  // 공연 삭제
  async remove(performanceId: number) {
    const existperformance = await this.performanceRepository.findOne({
      where: { performanceId },
    });

    if (!existperformance) {
      throw new NotFoundException('존재하지 않은 데이터입니다.');
    }
    await this.performanceRepository.softDelete(performanceId);

    return { message: '삭제 완료' };
  }

  // 공연 검색
  async search(keyword: string) {
    const searchValue = await this.performanceRepository.find({
      where: {
        performanceTitle: Like(`%${keyword}%`),
      },
    });
    return searchValue;
  }
}
