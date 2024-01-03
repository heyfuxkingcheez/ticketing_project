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
  Query,
} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { CreateScheduleDto } from './../schedule/dto/create-schedule.dto';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateScheduleDto } from 'src/schedule/dto/update-schedule.dto';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  // 공연 등록
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async create(
    @Body()
    createPerformanceDto: CreatePerformanceDto,
    @Body()
    createScheduleDto: CreateScheduleDto,
    @Body()
    playDate: Date,
  ) {
    return await this.performanceService.create(
      createPerformanceDto,
      createScheduleDto,
      playDate,
    );
  }

  // 공연 검색
  @Get('search')
  searchPerformances(@Query('keyword') keyword: string) {
    return this.performanceService.search(keyword);
  }

  // 공연 전체 조회
  @Get()
  findAll() {
    return this.performanceService.findAll();
  }

  // 해당 공연 좌석 조회
  @UseGuards(AuthGuard('jwt'))
  @Get(':performanceId/seats/:scheduleId')
  findOneSeats(
    @UserInfo() user: User,
    @Param('performanceId')
    performanceId: string,
    @Param('scheduleId') scheduleId: string,
  ) {
    return this.performanceService.findOneSeats(
      +performanceId,
      user,
      +scheduleId,
    );
  }

  // 공연 상세 조회
  @Get(':performanceId')
  findOne(@Param('performanceId') performanceId: string) {
    return this.performanceService.findOne(+performanceId);
  }

  // 공연 수정
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch(':performanceId')
  update(
    @Param('performanceId') performanceId: string,
    @Body() updatePerformanceDto: UpdatePerformanceDto,
  ) {
    return this.performanceService.update(+performanceId, updatePerformanceDto);
  }

  // 공연 삭제
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete(':performanceId')
  remove(@Param('performanceId') performanceId: string) {
    return this.performanceService.remove(+performanceId);
  }
}
