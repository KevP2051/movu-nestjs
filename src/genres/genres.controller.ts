import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) { }


  @Get()
  findAllByContentType(@Query('contentType') contentType: ContentTypeEnum) {

    if (!contentType) return this.genresService.findAll();

    return this.genresService.findAllByType(contentType);
  }


}
