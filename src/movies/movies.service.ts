import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { TmdbService } from 'src/apis/tmdb/tmdb.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MoviesService {

  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    private readonly tmdbService: TmdbService,
  ) { }



  createMovie(createMovieDto: CreateMovieDto) {


    try {
      const movie = this.movieRepository.create(createMovieDto);

      return this.movieRepository.save(movie);
    } catch (error) {
      console.log(error)
    }

  }

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
    return await this.tmdbService.getPopularMovies(1);
  }

  getMovieDetails(tmdbId: number) {

  }

}
