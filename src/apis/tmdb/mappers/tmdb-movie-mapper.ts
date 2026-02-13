import { TmdbMovieListResponse } from "../interfaces";

export class TmdbMovieMapper {

    static toMovieList(data: TmdbMovieListResponse) {
        return {
            page: data.page,
            totalPages: data.total_pages,
            totalResults: data.total_results,
            movies: data.results.map(movie => ({

                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                releaseDate: movie.release_date,
                posterPath: movie.poster_path,
                popularity: movie.popularity,
                voteAverage: movie.vote_average,
            }))
        }
    }



}