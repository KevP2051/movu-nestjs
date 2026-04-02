import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TmdbModule } from 'src/apis/tmdb/tmdb.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { GenreEntity } from 'src/genres/entities/genre.entity';
import { ContentModule } from 'src/content/content.module';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [TmdbModule, ContentModule, TypeOrmModule.forFeature([MovieEntity, GenreEntity])],
  exports: [MoviesService],
})
export class MoviesModule { }
