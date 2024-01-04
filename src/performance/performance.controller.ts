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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('PERFORMANCES')
@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  // 공연 등록
  @ApiOperation({ summary: '공연 등록' })
  @ApiBearerAuth('accessToken')
  @ApiResponse({
    status: 200,
    description: '공연 등록 성공',
  })
  @ApiResponse({
    status: 401,
    description: '권한이 없습니다..',
  })
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
  @ApiOperation({ summary: '공연 검색' })
  @ApiResponse({
    status: 200,
    description: '공연 검색 성공',
  })
  @ApiResponse({
    status: 404,
    description: '공연이 존재하지 않습니다.',
  })
  @ApiQuery({
    name: 'search',
    description: '검색어',
    required: true,
  })
  @Get('search')
  searchPerformances(@Query('keyword') keyword: string) {
    return this.performanceService.search(keyword);
  }

  // 공연 전체 조회
  @ApiOperation({ summary: '공연 전체 조회' })
  @ApiResponse({
    status: 200,
    description: '공연 목록 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '공연이 존재하지 않습니다.',
  })
  @Get()
  findAll() {
    return this.performanceService.findAll();
  }

  // 해당 공연 좌석 조회
  @ApiOperation({ summary: '해당 공연 좌석 조회' })
  @ApiBearerAuth('accessToken')
  @ApiResponse({
    status: 200,
    description: '해당 공연 좌석 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '좌석 정보가 존재하지 않습니다.',
  })
  @ApiQuery({
    name: 'performanceId',
    description: '공연 ID',
    required: true,
  })
  @ApiQuery({
    name: 'scheduleId',
    description: '스케줄 ID',
    required: true,
  })
  @ApiBearerAuth()
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
  @ApiOperation({ summary: '공연 상세 조회' })
  @ApiResponse({
    status: 200,
    description: '공연 상세 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '공연이 존재하지 않습니다.',
  })
  @ApiQuery({
    name: 'performanceId',
    description: '공연 ID',
    required: true,
  })
  @Get(':performanceId')
  findOne(@Param('performanceId') performanceId: string) {
    return this.performanceService.findOne(+performanceId);
  }

  // 공연 수정
  @ApiOperation({ summary: '공연 수정' })
  @ApiBearerAuth('accessToken')
  @ApiResponse({
    status: 200,
    description: '공연 수정 성공',
    type: UpdatePerformanceDto,
  })
  @ApiResponse({
    status: 401,
    description: '권한이 없습니다.',
  })
  @ApiQuery({
    name: 'performanceId',
    description: '공연 ID',
    required: true,
  })
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
  @ApiOperation({ summary: '공연 삭제' })
  @ApiBearerAuth('accessToken')
  @ApiResponse({
    status: 200,
    description: '공연 삭제 성공',
  })
  @ApiResponse({
    status: 401,
    description: '권한이 없습니다.',
  })
  @ApiQuery({
    name: 'performanceId',
    description: '공연 ID',
    required: true,
  })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete(':performanceId')
  remove(@Param('performanceId') performanceId: string) {
    return this.performanceService.remove(+performanceId);
  }
}
