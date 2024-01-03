import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Performance } from 'src/performance/entities/performance.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Performance)
    private performancRepository: Repository<Performance>,
  ) {}

  // 공연 시간표 등록
  async create(
    createScheduleDto: CreateScheduleDto,
    performanceId: number,
    playDate: any,
  ) {
    console.log('공연 시간표 등록 날짜', playDate.playDate);
    const { startTime, endTime, standardLimit, royalLimit, vipLimit } =
      createScheduleDto;
    const findStartTime: any = `${playDate.playDate} ${startTime}`;
    const findEndTime: any = `${playDate.playDate} ${endTime}`;
    try {
      // 이미 등록되어 있는지 확인
      const existTime = await this.scheduleRepository.findOne({
        where: {
          startTime: findStartTime,
          endTime: findEndTime,
        },
      });
      if (existTime) throw new Error('이미 존재 합니다.');

      const check = await this.performancRepository.findOne({
        where: { performanceId },
      });

      if (!check) new NotFoundException('데이터 조회 실패');

      const postTIme = await this.scheduleRepository.save({
        performance: { performanceId },
        startTime: `${playDate.playDate} ${startTime}`,
        endTime: `${playDate.playDate} ${endTime}`,
        standardLimit,
        royalLimit,
        vipLimit,
      });

      return { postTIme };
    } catch (error) {
      console.error(error);
      return { status: 400, message: '오류 발생' };
    }
  }

  // 스케줄 전체 조회
  async findAll() {
    return await this.scheduleRepository.find();
  }

  // 스케줄 상세 조회
  async findOne(performanceId: any) {
    const scheduleDetail = await this.scheduleRepository.findOne({
      where: { performance: performanceId.performanceId },
    });
    return scheduleDetail;
  }

  async update(createScheduleDto: CreateScheduleDto, scheduleId: string) {
    try {
      console.log('스케줄 아이디', scheduleId);
      const updatedSchedule = await this.scheduleRepository.update(
        scheduleId,
        createScheduleDto,
      );
      return { updatedSchedule };
    } catch (error) {
      console.error(error);
    }
  }

  async remove(id: any) {
    await this.scheduleRepository.delete(id);
    return { message: '삭제 완료' };
  }
}
