import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { SeriesService } from './series.service';
import { OptionalAuth, GetUser } from 'src/auth/decorators';
import { User } from 'src/users/entities/user.entity';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) { }


  @Get(':id')
  @OptionalAuth()
  findSeriesDetails(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.seriesService.findOne(id, user?.id);
  }

}
