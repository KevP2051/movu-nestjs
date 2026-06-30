import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, ParseUUIDPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }


  @Get(':id')
  findMovieDetails(@Param('id', ParseUUIDPipe) id: string) {
    return this.moviesService.findOne(id);
  }

}
