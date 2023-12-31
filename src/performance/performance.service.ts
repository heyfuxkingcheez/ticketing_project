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

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private dataSource: DataSource,
  ) {}

  // 공연 등록
  async create(
    createPerformanceDto: CreatePerformanceDto,
    createScheduleDto: CreateScheduleDto,
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
        startTime,
        endTime,
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
