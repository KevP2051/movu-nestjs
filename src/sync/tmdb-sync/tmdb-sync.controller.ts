import { Controller, Delete, Post, Query } from '@nestjs/common';
import { TmdbSyncService } from './tmdb-sync.service';

import { TmdbSyncPaginationDto } from './dto/tmdb-sync-pagination.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Controller('tmdb-sync')
export class TmdbSyncController {
  constructor(private readonly tmdbSyncService: TmdbSyncService) { }

  @Post()
  syncAll(@Query() queryParameters: TmdbSyncPaginationDto) {
    return this.tmdbSyncService.syncAll(queryParameters);
  }

  @Post('movie-genres')
  syncMovieGenres() {
    return this.tmdbSyncService.syncMovieGenres();
  }

  @Post('series-genres')
  syncSeriesGenres() {
    return this.tmdbSyncService.syncSeriesGenres();
  }

  @Post('popular-movies')
  syncPopularMovies(@Query() queryParameters: TmdbSyncPaginationDto) {
    return this.tmdbSyncService.syncPopularMovies(queryParameters);
  }

  @Post('popular-series')
  syncPopularSeries(@Query() queryParameters: TmdbSyncPaginationDto) {
    return this.tmdbSyncService.syncPopularSeries(queryParameters);
  }

  clearSyncedData() {
    return this.tmdbSyncService.clearSyncedData();
  }



}
