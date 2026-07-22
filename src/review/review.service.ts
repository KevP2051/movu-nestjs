import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Review
  ) { }


  create(createReviewDto: CreateReviewDto, userId: string) {

    try {



    } catch (error) {

    }
    return 'This action adds a new review';
  }

  findAll() {
    return `This action returns all review`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
