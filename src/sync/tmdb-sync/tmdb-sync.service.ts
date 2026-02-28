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

  syncPopularSeries({ page = 1, maxPages = 1 }: TmdbSyncPaginationDto) {



  }

  async syncPopularMovies({ page = 1, maxPages = 1 }: TmdbSyncPaginationDto) {
    try {
      let movies: Movie[] = [];
      let successCount = 0;
      let errorCount = 0;

      for (let currentPage = page; currentPage <= maxPages; currentPage++) {
        try {
          const pageMovies = await this.tmdbService.getPopularMovies(currentPage);
          movies.push(...pageMovies);
        } catch (error) {
          console.error(`Failed to fetch page ${currentPage}:`, error.message);
        }
      }

      console.log(`Fetched ${movies.length} valid movies`);

      for (const movie of movies) {
        try {
          await this.moviesService.createOrUpdateMovie(movie);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to save movie ${movie.tmdbId} (${movie.title}):`, error.message);
        }
      }

      return {
        totalFetched: movies.length,
        successCount,
        errorCount,
        message: `Sync completed: ${successCount} saved, ${errorCount} failed`
      };

    } catch (error) {
      console.error('Critical error in syncPopularMovies:', error);
      throw error;
    }
  }



}
