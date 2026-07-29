import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentEntity } from './entities/content.entity';
import { Repository } from 'typeorm';
import { GenresService } from 'src/genres/genres.service';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { FavoriteService } from 'src/favorite/favorite.service';
import { FindContentDto } from './dto/find-content.dto';
import { ContentSortEnum } from './enums/content-sort.enum';

@Injectable()
export class ContentService {

  constructor(
    @InjectRepository(ContentEntity)
    private readonly contentRepository: Repository<ContentEntity>,
    private readonly genresService: GenresService,
    private readonly wishlistService: WishlistService,
    private readonly favoriteService: FavoriteService
  ) { }


  async create(createContentDto: CreateContentDto) {

    const genres = await this.genresService.findAllByTmdbIds(createContentDto.genreIds!, createContentDto.type!);

    const content = this.contentRepository.create({ ...createContentDto, genres: genres });
    return await this.contentRepository.save(content);

  }


  async getHomeContent(contentType: ContentTypeEnum, userId?: string) {

    // Todo el contenido del tipo (con sus géneros) en UNA sola consulta,
    // en lugar de una consulta por cada género.
    const [genres, contents] = await Promise.all([
      this.genresService.findAllByType(contentType),
      this.contentRepository.find({
        where: { type: contentType },
        relations: { genres: true }
      })
    ]);

    const contentIds = contents.map((content) => content.id);

    // Una consulta para wishlist y otra para favoritos (no una por contenido).
    const [wishlistedIds, favoritedIds] = userId
      ? await Promise.all([
        this.wishlistService.getWishlistedContentIds(userId, contentIds),
        this.favoriteService.getFavoritedContentIds(userId, contentIds)
      ])
      : [new Set<string>(), new Set<string>()];

    const contentByGenre = genres.map((genre) => ({
      genre: genre.name,
      content: contents
        .filter((content) => content.genres.some((g) => g.id === genre.id))
        .map((content) => ({
          ...content,
          isInWishlist: wishlistedIds.has(content.id),
          isInFavorites: favoritedIds.has(content.id)
        }))
    }));

    return { contentByGenre };

  }


  async findAll(findContentDto: FindContentDto) {

    const { contentType, sortBy, genre, page = 1, limit = 20 } = findContentDto;

    const query = this.contentRepository.createQueryBuilder('content')
      .leftJoinAndSelect('content.genres', 'genre');

    if (contentType) {
      query.andWhere('content.type = :contentType', { contentType });
    }

    if (genre && genre !== 'all') {
      query.andWhere('genre.name = :genre', { genre });
    }

    switch (sortBy) {
      case ContentSortEnum.NEWEST:
        query.orderBy('content.releaseDate', 'DESC');
        break;
      case ContentSortEnum.OLDEST:
        query.orderBy('content.releaseDate', 'ASC');
        break;
      case ContentSortEnum.HIGHEST_RATING:
        query.orderBy('content.averageRating', 'DESC');
        break;
      case ContentSortEnum.LOWEST_RATING:
        query.orderBy('content.averageRating', 'ASC');
        break;
      case ContentSortEnum.MOST_REVIEWED:
        query.orderBy('content.reviewsCount', 'DESC');
        break;
      case ContentSortEnum.LEAST_REVIEWED:
        query.orderBy('content.reviewsCount', 'ASC');
        break;
      case ContentSortEnum.ALPHABETICAL:
        query.orderBy('content.title', 'ASC');
        break;
      default:
        query.orderBy('content.title', 'ASC');
    }

    query
      .skip((page - 1) * limit)
      .take(limit);

    const [contents, total] = await query.getManyAndCount();

    return {
      data: contents,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };

  }

  async findOne(contentId: string) {
    try {
      const content = await this.contentRepository.findOne({ where: { id: contentId } });
      if (!content) {
        throw new NotFoundException('Content not found');
      }
      return content;
    } catch (error) {

    }

  }

  update(id: number, updateContentDto: UpdateContentDto) {
    return `This action updates a #${id} content`;
  }

  remove(id: number) {
    return `This action removes a #${id} content`;
  }

  findReviewsByContent(contentId: string) {

  }

  async updateRatingStats(contentId: string, newRating: number, reviewsCount: number) {
    const content = await this.contentRepository.preload({
      id: contentId,
      averageRating: newRating,
      reviewsCount: reviewsCount
    });

    if (!content) {
      throw new NotFoundException(`Content with id ${contentId} not found`);
    }

    await this.contentRepository.save(content);

  }
}
