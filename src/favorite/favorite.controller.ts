import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/users/entities/user.entity';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) { }

  @Post()
  @Auth()
  create(@GetUser() user: User, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.create(user.id, createFavoriteDto);
  }

  @Get()
  @Auth()
  findAllByUser(@GetUser() user: User) {
    return this.favoriteService.findAllByUser(user.id);
  }

  @Get(':id')
  @Auth()
  findOne(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.favoriteService.findOne(user.id, id);
  }

  @Delete(':id')
  @Auth()
  remove(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.favoriteService.remove(user.id, id);
  }
}
