import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto, SetSeatDto } from './dto/create-reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { string } from 'joi';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('RESERVATIONS')
@UseGuards(AuthGuard('jwt'))
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // 공연 예매
  @ApiOperation({ summary: '공연 예매' })
  @ApiQuery({
    name: 'value',
    description: '공연 ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '예매 성공',
  })
  @Post()
  create(
    // @Body() createReservationDto: CreateReservationDto,
    @Req() req: any,
    @Body() setSeatDto: SetSeatDto,
    @Query('value') value: string,
  ) {
    const seat = setSeatDto.seats;
    const bodyScheduleId = setSeatDto.scheduleId;
    const id = req.user.userId;
    console.log('좌석 obj ===>', seat);
    console.log('유저 id ===>', id);
    console.log('공연 id ===>', +value);
    console.log('스케줄 id ===>', bodyScheduleId);
    return this.reservationService.create(seat, id, +value, bodyScheduleId);
  }

  // 예매 목록 조회
  @ApiOperation({ summary: '예매 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '예메 목록 조회 성공',
  })
  @Get()
  findAll(@UserInfo() user: User) {
    return this.reservationService.findAll(user);
  }

  // 예매 취소
  @ApiOperation({ summary: '예매 취소' })
  @ApiResponse({
    status: 200,
    description: '예매 취소 성공',
  })
  @ApiQuery({
    name: 'value',
    description: '공연 ID',
    required: true,
  })
  @Delete()
  remove(@UserInfo() user: User, @Query('value') value: string) {
    return this.reservationService.remove(+value, user);
  }
}
