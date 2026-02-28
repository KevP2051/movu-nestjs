import { Injectable } from '@nestjs/common';
import { CreateTmdbSyncDto } from './dto/create-tmdb-sync.dto';
import { UpdateTmdbSyncDto } from './dto/update-tmdb-sync.dto';
import { TmdbService } from 'src/apis/tmdb/tmdb.service';
import { MoviesService } from 'src/movies/movies.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { Movie } from 'src/common/interfaces/movie.interface';
import { TmdbSyncPaginationDto } from './dto/tmdb-sync-pagination.dto';

@Injectable()
export class TmdbSyncService {

  constructor(
    private readonly tmdbService: TmdbService,
    private readonly moviesService: MoviesService
  ) {
  }


  syncGenres() {

  }

  syncPopularSeries({ page = 1, totalPages = 1 }: TmdbSyncPaginationDto) {



  }

  async syncPopularMovies({ page = 1, totalPages = 1 }: TmdbSyncPaginationDto) {

    let movies: Movie[] = [];

    for (let currentPage = page; currentPage <= totalPages; currentPage++) {
      movies = [...movies, ...(await this.tmdbService.getPopularMovies(currentPage))]
    }

    movies.forEach(movie => { this.moviesService.createMovie(movie) })
  }



}
