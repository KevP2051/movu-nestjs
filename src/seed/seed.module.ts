import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { User } from 'src/users/entities/user.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { ContentEntity } from 'src/content/entities/content.entity';
import { WishlistEntity } from 'src/wishlist/entities/wishlist.entity';
import { FavoriteEntity } from 'src/favorite/entities/favorite.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User, ReviewEntity, ContentEntity, WishlistEntity, FavoriteEntity])],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService]
})
export class SeedModule { }
