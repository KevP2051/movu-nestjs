import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) { }


  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  @Get('movies')
  findMovieGenres() {
    return this.genresService.findAllByType(ContentTypeEnum.MOVIE);
  }

  @Get('series')
  findSeriesGenres() {
    return this.genresService.findAllByType(ContentTypeEnum.SERIES);
  }

  @Get('movies/:id')
  findOneMovieGenre(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.findOneByType(id, ContentTypeEnum.MOVIE);
  }

  @Get('series/:id')
  findOneSeriesGenre(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.findOneByType(id, ContentTypeEnum.SERIES);
  }

}
