import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class TmdbService {
    //TODO! Move baseURL to env file
    private readonly baseUrl = 'https://api.themoviedb.org/3';
    private readonly apiKey = process.env.TMDB_API_KEY;


    constructor(

        private readonly http: AxiosAdapter,

    ) { }


    getMovie(tmdbId: number) {
        return this.http.get<any>(`${this.baseUrl}/movie/${tmdbId}?api_key=${this.apiKey}`);
    }

    getPopularMovies() {
        return this.http.get<any>(`${this.baseUrl}/movie/popular?api_key=${this.apiKey}`);
    }


}
