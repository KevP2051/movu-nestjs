import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [TypeOrmModule.forFeature([Review])],
})
export class ReviewModule { }
