import { Module } from '@nestjs/common';
import { TmdbSyncService } from './tmdb-sync.service';
import { TmdbSyncController } from './tmdb-sync.controller';

@Module({
  controllers: [TmdbSyncController],
  providers: [TmdbSyncService],
})
export class TmdbSyncModule {}
