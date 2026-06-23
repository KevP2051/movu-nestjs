import { ConsoleLogger, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { TmdbService } from 'src/apis/tmdb/tmdb.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { Repository, In } from 'typeorm';
import { FindMovieDto } from './dto/find-movie.dto';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { Movie } from 'src/common/interfaces/movie.interface';
import { GenreEntity } from 'src/genres/entities/genre.entity';
import { ContentFactoryService } from '../content/content-factory.service';
import { CreateContentDto } from 'src/content/dto/create-content.dto';

@Injectable()
export class MoviesService {


  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
    private readonly tmdbService: TmdbService,
    private readonly contentFactoryService: ContentFactoryService,
  ) { }



  async createMovie(createContentDto: CreateContentDto) {

    this.contentFactoryService.createOrUpdateMovieWithContent(createContentDto);

  }

  async createOrUpdateMovie(movieData: CreateMovieDto) {

    const existingMovie = await this.movieRepository.findOneBy({ id: movieData.id });

    if (existingMovie) {
      return this.movieRepository.save({ ...existingMovie, ...movieData });
    }

    const movie = this.movieRepository.create(movieData);
    return await this.movieRepository.save(movie);

  }


  async findMoviesByGenre(genreId: number) {

    const moviesByGenre = await this.movieRepository.find({
      where: {
        content: {
          genres: {
            tmdbId: genreId
          }
        }
      },
      relations: ['content', 'content.genres']
    });

    return moviesByGenre;
  }


  //TODO: Add sorting by reviews, score, etc.
  async findAllMovies({ genreId, sortBy, sortOrder = 'DESC', page = 1, limit = 20 }: FindMovieDto) {
    const qb = this.movieRepository.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.content', 'content')
      .leftJoinAndSelect('content.genres', 'genres');

    if (genreId) {
      qb.andWhere('genres.tmdbId = :genreId', { genreId });
    }

    if (sortBy) {
      qb.orderBy(`content.${sortBy}`, sortOrder);
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

  findOne(tmdbId: number) {
    return this.movieRepository.findOne({
      where: { content: { tmdbId } },
      relations: ['content', 'content.genres']
    });
  }

  searchMovies(query: string) {
    return `This action searches movies with query: ${query}`;
  }

  async getPopularMovies({ page = 1, limit = 20 }: PaginationDto) {
    return this.findAllMovies({ page, limit, sortBy: 'popularity', sortOrder: 'DESC' });
  }


  async getHomeMovies() {
    const genres = await this.genreRepository.find()

    const moviesByGenre = await Promise.all(genres.map(async (genre) => {
      const movies = await this.findMoviesByGenre(genre.tmdbId);
      return {
        genre: genre.name,
        movies: movies.slice(0, 5)
      };
    }));

    return moviesByGenre;
  }

}
