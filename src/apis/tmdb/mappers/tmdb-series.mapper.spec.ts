import { TmdbSeriesMapper } from './tmdb-series.mapper';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';

describe('TmdbSeriesMapper', () => {

    const details: any = {
        id: 1399,
        name: 'Game of Thrones',
        overview: 'Seven noble families fight for control.',
        first_air_date: '2011-04-17',
        poster_path: '/poster.jpg',
        backdrop_path: '/backdrop.jpg',
        popularity: 123.4,
        adult: false,
        genres: [{ id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 18, name: 'Drama' }],
        number_of_seasons: 8,
        number_of_episodes: 73,
        credits: { id: 1399, cast: [], crew: [] },
    };

    it('maps tv fields to content fields', () => {
        const dto = TmdbSeriesMapper.toSeriesWithCredits(details);

        expect(dto.title).toBe('Game of Thrones');
        expect(dto.releaseDate).toBe('2011-04-17');
        expect(dto.type).toBe(ContentTypeEnum.SERIES);
        expect(dto.genreIds).toEqual([10765, 18]);
        expect(dto.numberOfSeasons).toBe(8);
        expect(dto.numberOfEpisodes).toBe(73);
    });

    it('drops list results missing required fields', () => {
        const list: any = {
            results: [
                { id: 1, name: 'Ok', poster_path: '/p.jpg', overview: 'o', first_air_date: '2020-01-01', genre_ids: [18], popularity: 1, adult: false },
                { id: 2, name: 'No poster', poster_path: null, overview: 'o', first_air_date: '2020-01-01', genre_ids: [], popularity: 1, adult: false },
            ],
        };

        const series = TmdbSeriesMapper.toSeriesList(list);

        expect(series).toHaveLength(1);
        expect(series[0].title).toBe('Ok');
    });
});
