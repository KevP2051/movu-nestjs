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


  findAll() {
    return `This action returns all content`;
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
