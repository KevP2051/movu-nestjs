import { Movie } from "src/common/interfaces/movie.interface";
import { TmdbMovieListResponse } from "../interfaces";

export class TmdbMovieMapper {

    static toMovieList(data: TmdbMovieListResponse): Movie[] {

        const movies: Movie[] = data.results.map(movie => ({
            tmdbId: movie.id,
            title: movie.title,
            overview: movie.overview,
            releaseDate: movie.release_date,
            posterPath: movie.poster_path,
            popularity: movie.popularity,
            genreIds: movie.genre_ids,
            adult: movie.adult
        }))
        return movies
    }


}
