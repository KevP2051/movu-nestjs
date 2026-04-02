import { Controller, Post, Query } from '@nestjs/common';
import { TmdbSyncService } from './tmdb-sync.service';

import { TmdbSyncPaginationDto } from './dto/tmdb-sync-pagination.dto';

@Controller('tmdb-sync')
export class TmdbSyncController {
  constructor(private readonly tmdbSyncService: TmdbSyncService) { }

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
    //tv show sync logic
  }



}
