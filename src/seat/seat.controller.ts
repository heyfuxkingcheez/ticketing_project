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
import { SeatService } from './seat.service';
import { CreateSeatDto, SetSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { string } from 'joi';
import { ApiAcceptedResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  // // 좌석 등록
  // @ApiOperation({ summary: '좌석 생성' })
  // @ApiQuery({
  //   name: 'performanceId',
  //   description: '공연 ID',
  //   required: true,
  // })
  // @UseGuards(AuthGuard('jwt'))
  // @Post(':performanceId')
  // create(
  //   @Req() req: any,
  //   @Body() setSeatDto: SetSeatDto,
  //   @Param('performanceId') performanceId: string,
  // ) {
  //   const seat = setSeatDto;
  //   const id = req.user;
  //   console.log('좌석 등급, 번호 ===>', seat);
  //   console.log('jwt 통과 후 나온 값 ===>', id.userId);
  //   console.log('공연 id ===>', +performanceId);
  //   // return this.seatService.create(createSeatDto);
  // }
}
