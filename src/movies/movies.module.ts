import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TmdbModule } from 'src/apis/tmdb/tmdb.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [TmdbModule, TypeOrmModule.forFeature([MovieEntity])],
  exports: [MoviesService],
})
export class MoviesModule { }
