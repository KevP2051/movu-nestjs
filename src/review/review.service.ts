import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ContentService } from 'src/content/content.service';
import { FindReviewsDto } from './dto/find-reviews.dto';
import { ReviewSortEnum } from './enums/review-sort.enum';

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

  async findByContent(
    contentId: string,
    findReviewsDto: FindReviewsDto,
    userId?: string
  ) {
    const {
      page = 1,
      limit = 20,
      rating,
      sort,
    } = findReviewsDto;

    const query = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.contentId = :contentId', { contentId });

    if (rating) {
      query.andWhere('review.rating = :rating', { rating });
    }

    if (userId) {
      query.andWhere('review.userId != :userId', { userId });
    }

    switch (sort) {
      case ReviewSortEnum.NEWEST:
        query.orderBy('review.createdAt', 'DESC');
        break;

      case ReviewSortEnum.OLDEST:
        query.orderBy('review.createdAt', 'ASC');
        break;

      case ReviewSortEnum.HIGHEST_RATED:
        query.orderBy('review.rating', 'DESC');
        break;

      case ReviewSortEnum.LOWEST_RATED:
        query.orderBy('review.rating', 'ASC');
        break;

      default:
        query.orderBy('review.createdAt', 'DESC');
    }

    query
      .skip((page - 1) * limit)
      .take(limit);

    const [reviews, total] = await query.getManyAndCount();

    return {
      data: reviews,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneByUserAndContent(contentId: string, userId: string) {

    const content = await this.contentService.findOne(contentId);
    const review = await this.reviewRepository.findOne({ where: { content: { id: content?.id }, user: { id: userId } }, relations: { user: true } });
    return review;
  }

  async update(id: string, userId: string, updateReviewDto: UpdateReviewDto) {

    const reviewToUpdate = await this.reviewRepository.findOne({ where: { id }, relations: { user: true } });

    if (!reviewToUpdate) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    if (reviewToUpdate.user.id !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }
    Object.assign(reviewToUpdate, updateReviewDto);

    await this.reviewRepository.save(reviewToUpdate);

    return { message: `Review with id ${id} has been updated` }


  }

  async remove(id: string, userId: string) {

    const reviewToDelete = await this.reviewRepository.findOne({ where: { id }, relations: { user: true } });

    if (!reviewToDelete) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    if (reviewToDelete.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(reviewToDelete);

    return { message: `Review with id ${id} has been deleted` };

  }
}
