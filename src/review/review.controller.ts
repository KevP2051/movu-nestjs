import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/users/entities/user.entity';
import { FindReviewsDto } from './dto/find-reviews.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Get(':contentId')
  findByContent(
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @Query() findReviewsDto: FindReviewsDto
  ) {
    return this.reviewService.findByContent(contentId, findReviewsDto);
  }

  @Post()
  @Auth()
  create(@Body() createReviewDto: CreateReviewDto, @GetUser() user: User) {

    return this.reviewService.create(createReviewDto, user.id);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.reviewService.remove(id, user.id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, user.id, updateReviewDto);
  }


}
