import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { TmdbMovieListResponse, TmdbSeriesGenresResponse, TmdbMovieGenresResponse } from './interfaces';
import { TmdbMovieMapper } from './mappers/tmdb-movie.mapper';
import { TmdbGenresMapper } from './mappers/tmdb-genres.mapper';
import { TmdbMovieCreditsResponse } from './interfaces/tmdb-movie-credits.response';
import { TmdbCreditMapper } from './mappers/tmdb-credit.mapper';

@Injectable()
export class TmdbService {
    //TODO! Move baseURL to env file
    private readonly baseUrl = 'https://api.themoviedb.org/3';
    private readonly apiKey = process.env.TMDB_API_KEY;
    private readonly headers = {
        Authorization: `Bearer ${this.apiKey}`,
        accept: 'application/json',
    };


    constructor(

        private readonly http: AxiosAdapter,

    ) { }


    async getMovie(tmdbId: number) {

        return await this.http.get<any>(`${this.baseUrl}/movie/${tmdbId}?api_key=${this.apiKey}`, { headers: this.headers });
    }

    async getPopularMovies(page: number) {
        const url = `${this.baseUrl}/movie/popular?page=${page}`;
        return TmdbMovieMapper.toMovieList(await this.http.get<TmdbMovieListResponse>(url, { headers: this.headers }));
    }

    async searchMovies(query: string) {
        return await this.http.get<any>(`${this.baseUrl}/search/movie?query=${encodeURIComponent(query)}`, { headers: this.headers });
    }

    async getMovieGenres() {

        return TmdbGenresMapper.toMovieGenre(await this.http.get<TmdbMovieGenresResponse>(`${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`, { headers: this.headers }));

    }

    async getSeriesGenres() {
        return TmdbGenresMapper.toSeriesGenre(await this.http.get<TmdbSeriesGenresResponse>(`${this.baseUrl}/genre/tv/list?api_key=${this.apiKey}`, { headers: this.headers }));
    }

    async getMovieCredits(tmdbId: number) {
        return TmdbCreditMapper.toContentCreditEntity(await this.http.get<TmdbMovieCreditsResponse>(`${this.baseUrl}/movie/${tmdbId}/credits?api_key=${this.apiKey}`, { headers: this.headers }));
    }

    async getSeriesCast(tmdbId: number) {
        return await this.http.get<any>(`${this.baseUrl}/tv/${tmdbId}/credits?api_key=${this.apiKey}`, { headers: this.headers });
    }
}
