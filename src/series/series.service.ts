import { Injectable } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SeriesEntity } from './entities/series.entity';
import { Repository } from 'typeorm';
import { GenreEntity } from 'src/genres/entities/genre.entity';
import { ContentFactoryService } from '../content/content-factory.service';
import { CreateContentDto } from 'src/content/dto/create-content.dto';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { FavoriteService } from 'src/favorite/favorite.service';

@Injectable()
export class SeriesService {


  constructor(
    @InjectRepository(SeriesEntity)
    private readonly seriesRepository: Repository<SeriesEntity>,
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
    private readonly contentFactoryService: ContentFactoryService,
    private readonly wishlistService: WishlistService,
    private readonly favoriteService: FavoriteService,
  ) { }



  async createSeries(createContentDto: CreateContentDto) {

    return this.contentFactoryService.createOrUpdateSeries(createContentDto);

  }

  async createOrUpdateSeries(seriesData: CreateSeriesDto) {

    const existingSeries = await this.seriesRepository.findOneBy({ id: seriesData.id });

    if (existingSeries) {
      return this.seriesRepository.save({ ...existingSeries, ...seriesData });
    }

    const series = this.seriesRepository.create(seriesData);
    return await this.seriesRepository.save(series);

  }

  async findOne(id: string, userId?: string) {
    const series = await this.seriesRepository.findOne({
      where: { content: { id } },
      relations: {
        content: {
          genres: true,
          contentCredits: {
            person: true
          }
        }
      }
    });

    if (!series) {
      return series;
    }

    const [isInWishlist, isInFavorites] = userId
      ? await Promise.all([
        this.wishlistService.isContentInWishlist(userId, id),
        this.favoriteService.isContentInFavorites(userId, id)
      ])
      : [false, false];

    return { ...series, isInWishlist, isInFavorites };
  }

}
