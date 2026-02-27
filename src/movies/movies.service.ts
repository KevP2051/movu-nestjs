import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { TmdbService } from 'src/apis/tmdb/tmdb.service';

@Injectable()
export class MoviesService {

  constructor(
    private readonly tmdbService: TmdbService,
  ) { }


  findAll() {
    return `This action returns all movies`;
  }

  findOne(id: number) {
    return this.tmdbService.getMovie(id);
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  searchMovies(query: string) {
    return `This action searches movies with query: ${query}`;
  }

  async getPopularMovies() {
    return await this.tmdbService.getPopularMovies();
  }

  getMovieDetails(tmdbId: number) {

  }

}
