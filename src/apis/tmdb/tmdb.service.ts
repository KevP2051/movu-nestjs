import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { TmdbMovieListResponse } from './interfaces';
import { TmdbMovieMapper } from './mappers/tmdb-movie-mapper';

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

    async getPopularMovies() {
        const url = `${this.baseUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
        return TmdbMovieMapper.toMovieList(await this.http.get<TmdbMovieListResponse>(url, { headers: this.headers }));
    }

    async searchMovies(query: string) {
        return await this.http.get<any>(`${this.baseUrl}/search/movie?query=${encodeURIComponent(query)}`, { headers: this.headers });
    }

}
