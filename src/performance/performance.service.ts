import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Performance } from './entities/performance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { Request } from 'express';
import { UpdatePerformanceDto } from './dto/update-performance.dto';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
  ) {}

  // 공연 등록
  async create(
    performanceTitle: string,
    startTime: string,
    endTime: string,
    age: number,
    price: number,
    image: string,
  ) {
    const post = await this.performanceRepository.save({
      performanceTitle,
      startTime,
      endTime,
      age,
      price,
      image,
    });

    return { post };
  }

  // 공연 전체 조회
  async findAll() {
    const performances = await this.performanceRepository.find();

    return { performances };
  }

  // 공연 상세 조회
  async findOne(performanceId: number) {
    const performance = await this.performanceRepository.findOne({
      where: { performanceId },
    });
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
      throw new NotFoundException('존재하지 않은 데이터입니다..');
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
      throw new NotFoundException('존재하지 않은 데이터입니다..');
    }
    await this.performanceRepository.softDelete(performanceId);

    return { message: '삭제 완료' };
  }
}
