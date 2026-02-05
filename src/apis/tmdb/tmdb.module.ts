import { Module } from '@nestjs/common';
import { TmdbService } from './tmdb.service';

@Module({
  controllers: [],
  providers: [TmdbService],
})
export class TmdbModule { }
