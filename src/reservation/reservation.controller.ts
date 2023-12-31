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

@UseGuards(AuthGuard('jwt'))
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // 공연 예매
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    // @Body() createReservationDto: CreateReservationDto,
    @Req() req: any,
    @Body() setSeatDto: SetSeatDto,
    @Query('value') value: string,
  ) {
    const seat = setSeatDto;
    const id = req.user.userId;
    console.log('좌석 obj ===>', seat);
    console.log('유저 id ===>', id);
    console.log('공연 id ===>', +value);
    return this.reservationService.create(seat, id, +value);
  }

  // 예매 목록 조회
  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  // 예매 상세 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }

  // 예매 취소
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }
}
