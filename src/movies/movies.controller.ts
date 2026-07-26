import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, ParseUUIDPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { OptionalAuth, GetUser } from 'src/auth/decorators';
import { User } from 'src/users/entities/user.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }


  @Get(':id')
  @OptionalAuth()
  findMovieDetails(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.moviesService.findOne(id, user?.id);
  }

}
