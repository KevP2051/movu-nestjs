import { PartialType } from '@nestjs/mapped-types';
import { CreateTmdbSyncDto } from './create-tmdb-sync.dto';

export class UpdateTmdbSyncDto extends PartialType(CreateTmdbSyncDto) {}
