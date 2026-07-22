import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ContentService } from 'src/content/content.service';

@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly contentService: ContentService

  ) { }


  async create(createReviewDto: CreateReviewDto, userId: string) {


    const existingReview = await this.findOneByUserAndContent(createReviewDto.contentId, userId);

    if (existingReview) {
      throw new ConflictException('User has already reviewed this content');
    }

    const review = this.reviewRepository.create({ ...createReviewDto, user: { id: userId }, content: { id: createReviewDto.contentId } });
    return await this.reviewRepository.save(review);
  }

  findAll() {
    //TODO! Implement pagination and filtering by rating
    //TODO This method should only return needed information about user and content, not the whole entities
    return this.reviewRepository.find({
      relations: {
        content: true,
        user: true
      }
    })
  }

  async findOneByUserAndContent(contentId: string, userId: string) {

    const content = await this.contentService.findOne(contentId);
    const review = await this.reviewRepository.findOne({ where: { content: { id: content?.id }, user: { id: userId } } });
    return review;
  }

  async update(id: string, userId: string, updateReviewDto: UpdateReviewDto) {

    const reviewToUpdate = await this.reviewRepository.findOne({ where: { id } });

    if (!reviewToUpdate) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    if (reviewToUpdate.user.id !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }


    await this.reviewRepository.update(id, updateReviewDto);
    return `This action updates a #${id} review`;
  }

  async remove(id: string, userId: string) {

    const reviewToDelete = await this.reviewRepository.findOne({ where: { id } });

    if (!reviewToDelete) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    if (reviewToDelete.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(reviewToDelete);

    return `Review with id ${id} has been deleted`;

  }
}
