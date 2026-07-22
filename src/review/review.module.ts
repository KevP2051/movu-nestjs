import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ContentModule } from 'src/content/content.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [TypeOrmModule.forFeature([Review]), ContentModule, AuthModule],
})
export class ReviewModule { }
