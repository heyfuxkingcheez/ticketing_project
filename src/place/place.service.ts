import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
  ) {}

  // 장소 등록
  async create(PerformanceId: number, place: string) {
    const createdPlace = await this.placeRepository.save({
      PerformanceId,
      place,
    });
    return createdPlace;
  }

  findAll() {
    return `This action returns all place`;
  }

  findOne(id: number) {
    return `This action returns a #${id} place`;
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    return `This action updates a #${id} place`;
  }

  async remove(placeId: number) {
    const existPlace = await this.placeRepository.findOne({
      where: { placeId },
    });

    if (!existPlace) {
      throw new NotFoundException('존재하지 않은 데이터입니다.');
    }
    await this.placeRepository.softDelete(placeId);

    return { message: '삭제 완료' };
  }
}
