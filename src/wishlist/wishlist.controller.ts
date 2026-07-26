import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/users/entities/user.entity';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Post()
  @Auth()
  create(@GetUser() user: User, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistService.create(user.id, createWishlistDto);
  }

  @Get()
  @Auth()
  findAllByUser(@GetUser() user: User) {
    return this.wishlistService.findAllByUser(user.id);
  }

  @Get(':contentId')
  @Auth()
  findOne(@GetUser() user: User, @Param('contentId', ParseUUIDPipe) contentId: string) {
    return this.wishlistService.findOne(user.id, contentId);
  }

  @Delete(':contentId')
  @Auth()
  remove(@GetUser() user: User, @Param('contentId', ParseUUIDPipe) contentId: string) {
    return this.wishlistService.remove(user.id, contentId);
  }
}
