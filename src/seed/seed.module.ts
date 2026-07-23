import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { User } from 'src/users/entities/user.entity';
import { Review } from 'src/review/entities/review.entity';
import { ContentEntity } from 'src/content/entities/content.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User, Review, ContentEntity])],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService]
})
export class SeedModule { }
