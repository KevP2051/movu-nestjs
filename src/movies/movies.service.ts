import { ConsoleLogger, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { TmdbService } from 'src/apis/tmdb/tmdb.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { Repository, In } from 'typeorm';
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

  findOne(id: string) {
    return this.movieRepository.findOne({
      where: { content: { id } },
      relations: {
        content: {
          genres: true,
          contentCredits: {
            person: true
          }
        }
      }
    });
  }

}
