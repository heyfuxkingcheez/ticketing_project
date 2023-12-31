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

@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':performanceId')
  create(
    @Req() req: any,
    @Body() setSeatDto: SetSeatDto,
    @Param('performanceId') performanceId: string,
  ) {
    const seat = setSeatDto;
    const id = req.user;
    console.log('좌석 등급, 번호 ===>', seat);
    console.log('jwt 통과 후 나온 값 ===>', id.userId);
    console.log('공연 id ===>', +performanceId);
    // return this.seatService.create(createSeatDto);
  }

  @Get()
  findAll() {
    return this.seatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeatDto: UpdateSeatDto) {
    return this.seatService.update(+id, updateSeatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seatService.remove(+id);
  }
}
