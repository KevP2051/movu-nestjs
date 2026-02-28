import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TmdbSyncService } from './tmdb-sync.service';
import { CreateTmdbSyncDto } from './dto/create-tmdb-sync.dto';
import { UpdateTmdbSyncDto } from './dto/update-tmdb-sync.dto';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Controller('tmdb-sync')
export class TmdbSyncController {
  constructor(private readonly tmdbSyncService: TmdbSyncService) { }

  @Post('genres')
  syncGenres() {
    //genre sync logic
  }

  @Post('popular-movies')
  syncPopularMovies(@Query() queryParameters: PaginationDto) {
    this.tmdbSyncService.syncPopularMovies(queryParameters);
  }

  @Post('popular-series')
  syncPopularSeries(@Query() queryParameters: PaginationDto) {
    //tv show sync logic
  }



}
