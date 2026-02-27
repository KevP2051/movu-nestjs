import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TmdbSyncService } from './tmdb-sync.service';
import { CreateTmdbSyncDto } from './dto/create-tmdb-sync.dto';
import { UpdateTmdbSyncDto } from './dto/update-tmdb-sync.dto';

@Controller('tmdb-sync')
export class TmdbSyncController {
  constructor(private readonly tmdbSyncService: TmdbSyncService) { }

  @Post('genres')
  syncGenres() {
    //genre sync logic
  }

  @Post('popular-movies')
  syncPopularMovies() {
    //movie sync logic
  }

  @Post('popular-series')
  syncPopularSeries() {
    //tv show sync logic
  }



}
