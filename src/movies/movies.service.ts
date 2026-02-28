import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { TmdbService } from 'src/apis/tmdb/tmdb.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { FindMovieDto } from './dto/find-movie.dto';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { Movie } from 'src/common/interfaces/movie.interface';

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

  async createOrUpdateMovie(movieData: CreateMovieDto) {
    const existing = await this.movieRepository.findOne({
      where: { tmdbId: movieData.tmdbId }
    });

    if (existing) {
      return this.movieRepository.save({ ...existing, ...movieData });
    }

    const movie = this.movieRepository.create(movieData);
    return this.movieRepository.save(movie);
  }


  findMovies() {

  }

  findMoviesByGenre(genreId: number) {

  }


  async findAllMovies({ genreId, sortBy, sortOrder = 'DESC', page = 1, limit = 20 }: FindMovieDto) {
    const qb = this.movieRepository.createQueryBuilder('movie');

    if (genreId) {
      qb.andWhere('movie.genreId = :genreId', { genreId });
    }

    if (sortBy) {
      qb.orderBy(`movie.${sortBy}`, sortOrder);
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return this.tmdbService.getMovie(id);
  }

  searchMovies(query: string) {
    return `This action searches movies with query: ${query}`;
  }

  async getPopularMovies({ page = 1, limit = 20 }: PaginationDto) {
    return this.findAllMovies({ page, limit, sortBy: 'popularity', sortOrder: 'DESC' });
  }

  getMovieDetails(tmdbId: number) {

  }

}
