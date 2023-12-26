import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  // 공연 등록
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Req() req: any,
    @Body() createPerformanceDto: CreatePerformanceDto,
  ) {
    return await this.performanceService.create(
      createPerformanceDto.performanceTitle,
      createPerformanceDto.startTime,
      createPerformanceDto.endTime,
      createPerformanceDto.age,
      createPerformanceDto.price,
      createPerformanceDto.image,
      req,
    );
  }

  // 공연 전체 조회
  @Get()
  findAll() {
    return this.performanceService.findAll();
  }

  // 공연 상세 조회
  @Get(':performanceId')
  findOne(@Param('performanceId') performanceId: string) {
    return this.performanceService.findOne(+performanceId);
  }

  // 공연 수정
  @UseGuards(AuthGuard('jwt'))
  @Patch(':performanceId')
  update(
    @Param('performanceId') performanceId: string,
    @Body() createPerformanceDto: CreatePerformanceDto,
    @Req() req: any,
  ) {
    return this.performanceService.update(
      +performanceId,
      createPerformanceDto,
      req,
    );
  }

  // 공연 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete(':performanceId')
  remove(@Param('performanceId') performanceId: string, @Req() req: any) {
    return this.performanceService.remove(+performanceId, req);
  }
}
