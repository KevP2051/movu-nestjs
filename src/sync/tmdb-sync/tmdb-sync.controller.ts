import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TmdbSyncService } from './tmdb-sync.service';
import { CreateTmdbSyncDto } from './dto/create-tmdb-sync.dto';
import { UpdateTmdbSyncDto } from './dto/update-tmdb-sync.dto';

@Controller('tmdb-sync')
export class TmdbSyncController {
  constructor(private readonly tmdbSyncService: TmdbSyncService) {}

  @Post()
  create(@Body() createTmdbSyncDto: CreateTmdbSyncDto) {
    return this.tmdbSyncService.create(createTmdbSyncDto);
  }

  @Get()
  findAll() {
    return this.tmdbSyncService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tmdbSyncService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTmdbSyncDto: UpdateTmdbSyncDto) {
    return this.tmdbSyncService.update(+id, updateTmdbSyncDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tmdbSyncService.remove(+id);
  }
}
