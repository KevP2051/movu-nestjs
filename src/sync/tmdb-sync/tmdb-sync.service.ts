import { Injectable } from '@nestjs/common';
import { TmdbService } from 'src/apis/tmdb/tmdb.service';
import { MoviesService } from 'src/movies/movies.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { Movie } from 'src/common/interfaces/movie.interface';
import { TmdbSyncPaginationDto } from './dto/tmdb-sync-pagination.dto';
import { GenresService } from 'src/genres/genres.service';
import { ContentFactoryService } from 'src/content/content-factory.service';

@Injectable()
export class TmdbSyncService {

  constructor(
    private readonly tmdbService: TmdbService,
    private readonly moviesService: MoviesService,
    private readonly genresService: GenresService,
    private readonly contentFactory: ContentFactoryService,
  ) {
  }


  async syncMovieGenres() {
    try {
      const genres = await this.tmdbService.getMovieGenres()

      for (const genre of genres) {
        await this.genresService.createOrUpdateGenre(genre);
      }

      return {
        totalSynced: genres.length,
        message: `Successfully synced ${genres.length} movie genres`
      }
    } catch (error) {

      //error handling logic
    }



  }

  async syncSeriesGenres() {
    try {

      const genres = await this.tmdbService.getSeriesGenres();
      for (const genre of genres) {
        await this.genresService.createOrUpdateGenre(genre);

      }
      return {
        totalSynced: genres.length,
        message: `Successfully synced ${genres.length} series genres`
      }

    } catch (error) {

    }
  }

  async syncPopularSeries({ page = 1, maxPages = 1 }: TmdbSyncPaginationDto) {

  }

  async syncPopularMovies({ page = 1, maxPages = 1 }: TmdbSyncPaginationDto) {

    let totalSynced = 0;

    for (let currentPage = page; currentPage <= maxPages; currentPage++) {
      try {
        const populars = await this.tmdbService.getPopularMovies(currentPage);

        for (const popular of populars) {
          const movie = await this.tmdbService.getMovieWithCredits(popular.tmdbId);
          await this.contentFactory.createOrUpdateMovie(movie);
          totalSynced++;
        }

      } catch (error) {
        console.error(`Failed to sync popular movies at page ${currentPage}`, error);
      }
    }

    return {
      totalSynced,
      message: `Successfully synced ${totalSynced} popular movies from pages ${page} to ${maxPages}`
    };
  }
}
