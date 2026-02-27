import { Module } from '@nestjs/common';
import { TmdbSyncService } from './tmdb-sync.service';
import { TmdbSyncController } from './tmdb-sync.controller';
import { TmdbModule } from 'src/apis/tmdb/tmdb.module';
import { MoviesService } from 'src/movies/movies.service';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  controllers: [TmdbSyncController],
  providers: [TmdbSyncService],
  imports: [TmdbModule, MoviesModule]
})
export class TmdbSyncModule { }
