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

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post(':performanceId')
  create(
    @Param() performanceId: string,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return this.scheduleService.create(createScheduleDto, performanceId);
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

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

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}
