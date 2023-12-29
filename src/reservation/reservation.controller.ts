import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // 공연 예매
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    console.log('공연 예매 api 호출!');
    return this.reservationService.create(createReservationDto);
  }

  // 예매 목록 조회
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  // 예매 상세 조회
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }

  // 예매 취소
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }
}
