import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('SCHEDULES')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // 스케줄 등록
  @ApiOperation({ summary: '스케줄 등록' })
  @ApiQuery({
    name: 'performanceId',
    required: true,
    description: '공연 ID',
  })
  @ApiResponse({
    status: 200,
    description: '스케줄 등록 성공',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post(':performanceId')
  create(
    @Param('performanceId') performanceId: string,
    @Body() createScheduleDto: CreateScheduleDto,
    @Body() playDate: Date,
  ) {
    return this.scheduleService.create(
      createScheduleDto,
      +performanceId,
      playDate,
    );
  }

  // 스케줄 목록 조회
  @ApiOperation({ summary: '스케줄 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '스케줄 목록 조회 성공',
    type: CreateScheduleDto,
  })
  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  // 스케줄 상세 조회
  @ApiOperation({ summary: '스케줄 상세 조회' })
  @ApiResponse({
    status: 200,
    description: '스케줄 상세 조회 성공',
    type: CreateScheduleDto,
  })
  @ApiQuery({
    name: 'performanceId',
    description: '공연 ID',
    required: true,
  })
  @Get(':performanceId')
  findOne(@Param('performanceId') performanceId: string) {
    return this.scheduleService.findOne(+performanceId);
  }

  // 스케줄 수정
  @ApiOperation({ summary: '스케줄 수정' })
  @ApiResponse({
    status: 200,
    description: '스케줄 수정 성공',
    type: CreateScheduleDto,
  })
  @ApiQuery({
    name: 'scheduleId',
    required: true,
    description: '스케줄 ID',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch('update/:scheduleId')
  update(
    @Param() scheduleId: string,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    console.log('컨트롤러에서 스케줄 아이디', scheduleId);
    return this.scheduleService.update(createScheduleDto, scheduleId);
  }

  // 스케줄 삭제
  @ApiOperation({ summary: '스케줄 삭제' })
  @ApiResponse({
    status: 200,
    description: '스케줄 삭제 성공',
  })
  @ApiQuery({
    name: 'performanceId',
    description: '공연 ID',
    required: true,
  })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete('delete/:performanceId')
  remove(@Param('performanceId') performanceId: string) {
    return this.scheduleService.remove(+performanceId);
  }
}
