import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { TmdbModule } from 'src/apis/tmdb/tmdb.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesEntity } from './entities/series.entity';
import { GenreEntity } from 'src/genres/entities/genre.entity';
import { ContentModule } from 'src/content/content.module';
import { WishlistModule } from 'src/wishlist/wishlist.module';
import { FavoriteModule } from 'src/favorite/favorite.module';

@Module({
  controllers: [SeriesController],
  providers: [SeriesService],
  imports: [TmdbModule, ContentModule, WishlistModule, FavoriteModule, TypeOrmModule.forFeature([SeriesEntity, GenreEntity])],
  exports: [SeriesService],
})
export class SeriesModule { }
