import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { FindMovieDto } from './dto/find-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Get()
  findAll(@Query() queryParameters: FindMovieDto) {
    return this.moviesService.findAllMovies(queryParameters);
  }

  @Get('popular')
  async getPopularMoviesByGenre(@Query() queryParameters: PaginationDto) {
    return await this.moviesService.getPopularMovies(queryParameters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Get('/home')
  getHomePageMovies() {
    return this.moviesService.getHomeMovies();
  }

}
