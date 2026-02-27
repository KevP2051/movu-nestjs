import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TmdbModule } from 'src/apis/tmdb/tmdb.module';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [TmdbModule],
  exports: [MoviesService],
})
export class MoviesModule { }
