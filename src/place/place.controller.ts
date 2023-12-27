import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';

@UseGuards(RolesGuard)
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() createPlaceDto: CreatePlaceDto) {
    return await this.placeService.create(
      createPlaceDto.PerformanceId,
      createPlaceDto.place,
    );
  }

  @Get()
  findAll() {
    return this.placeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placeService.update(+id, updatePlaceDto);
  }

  @Roles(Role.Admin)
  @Delete(':placeId')
  async remove(@Param('placeId') placeId: string) {
    return await this.placeService.remove(+placeId);
  }
}
