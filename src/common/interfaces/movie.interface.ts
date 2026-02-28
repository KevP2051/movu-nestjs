
export interface Movie {
    tmdbId: number;
    title: string;
    overview: string;
    releaseDate: Date;
    posterPath: string;
    popularity: number;
    genreIds: number[];
    adult: boolean;
}