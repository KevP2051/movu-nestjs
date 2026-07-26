import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseEnumPipe } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';
import { OptionalAuth, GetUser } from 'src/auth/decorators';
import { User } from 'src/users/entities/user.entity';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) { }

  @Post()
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @Get()
  findAll() {
    return this.contentService.findAll();
  }

  @Get('home')
  @OptionalAuth()
  getHomeContent(@Query('contentType', new ParseEnumPipe(ContentTypeEnum)) contentType: ContentTypeEnum, @GetUser() user: User) {
    return this.contentService.getHomeContent(contentType, user?.id);
  }
}