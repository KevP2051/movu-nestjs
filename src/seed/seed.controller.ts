import { Controller, Post, Delete, Body } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { SeedUsersDto } from './dto/seed-users.dto';
import { SeedReviewsDto } from './dto/seed-reviews.dto';
import { SeedDatabaseDto } from './dto/seed-database.dto';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @Post('users')
  seedUsers(@Body() seedUsersDto: SeedUsersDto) {
    return this.seedService.seedUsers(seedUsersDto);
  }

  @Post('reviews')
  seedReviews(@Body() seedReviewsDto: SeedReviewsDto) {
    return this.seedService.seedReviews(seedReviewsDto);
  }

  @Post()
  seedDatabase(@Body() seedDatabaseDto: SeedDatabaseDto) {
    return this.seedService.seedDatabase(seedDatabaseDto);
  }

  @Delete()
  clearSeededData() {
    return this.seedService.clearSeededData();
  }
}
