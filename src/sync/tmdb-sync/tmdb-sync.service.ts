import { Injectable } from '@nestjs/common';
import { CreateTmdbSyncDto } from './dto/create-tmdb-sync.dto';
import { UpdateTmdbSyncDto } from './dto/update-tmdb-sync.dto';

@Injectable()
export class TmdbSyncService {

  create(createTmdbSyncDto: CreateTmdbSyncDto) {
    return 'This action adds a new tmdbSync';
  }

  findAll() {
    return `This action returns all tmdbSync`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tmdbSync`;
  }

  update(id: number, updateTmdbSyncDto: UpdateTmdbSyncDto) {
    return `This action updates a #${id} tmdbSync`;
  }

  remove(id: number) {
    return `This action removes a #${id} tmdbSync`;
  }
}
