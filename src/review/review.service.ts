import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>
  ) { }


  async create(createReviewDto: CreateReviewDto, userId: string) {

    try {

      const existingReview = await this.findOneByUserAndContent(createReviewDto.contentId, userId);

      if (existingReview) {
        throw new ConflictException('User has already reviewed this content');
      }

      const review = this.reviewRepository.create({ ...createReviewDto, user: { id: userId }, content: { id: createReviewDto.contentId } });
      return await this.reviewRepository.save(review);

    } catch (error) {
      throw new Error('Error creating review');
    }
    return 'This action adds a new review';
  }

  findAll() {
    return `This action returns all review`;
  }

  async findOneByUserAndContent(contentId: string, userId: string) {

    try {

      const content = await this.reviewRepository.findOne({ where: { id: contentId } });

      if (!content) {
        throw new NotFoundException('Content not found');
      }

      const review = await this.reviewRepository.findOne({ where: { content: { id: contentId }, user: { id: userId } } });
      return review;
    } catch (error) {

    }


  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
