import { ContentService } from './content.service';

describe('ContentService.findAll', () => {

    const queryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    };

    const contentRepository: any = {
        createQueryBuilder: jest.fn(() => queryBuilder),
    };

    const service = new ContentService(contentRepository, {} as any, {} as any, {} as any);

    beforeEach(() => jest.clearAllMocks());

    it('matches titles partially and case-insensitively', async () => {
        await service.findAll({ search: 'matrix' });

        expect(queryBuilder.andWhere).toHaveBeenCalledWith(
            'content.title ILIKE :search',
            { search: '%matrix%' },
        );
    });

    it('does not filter by title when no search term is given', async () => {
        await service.findAll({});

        expect(queryBuilder.andWhere).not.toHaveBeenCalled();
    });
});

describe('ContentService.findTopRatedOfTheWeek', () => {

    const rankedRows = [
        { id: 'b', weeklyRating: '4.8', weeklyReviewsCount: '9' },
        { id: 'a', weeklyRating: '4.5', weeklyReviewsCount: '20' },
        { id: 'c', weeklyRating: '3.1', weeklyReviewsCount: '2' },
    ];

    const queryBuilder: any = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ count: '3' }),
        getRawMany: jest.fn().mockResolvedValue(rankedRows),
    };

    // find() returns rows in arbitrary DB order, not the ranked one.
    const contentRepository: any = {
        createQueryBuilder: jest.fn(() => queryBuilder),
        find: jest.fn().mockResolvedValue([
            { id: 'a', title: 'A' },
            { id: 'c', title: 'C' },
            { id: 'b', title: 'B' },
        ]),
    };

    const wishlistService: any = {
        getWishlistedContentIds: jest.fn().mockResolvedValue(new Set(['b'])),
    };

    const favoriteService: any = {
        getFavoritedContentIds: jest.fn().mockResolvedValue(new Set(['c'])),
    };

    const service = new ContentService(contentRepository, {} as any, wishlistService, favoriteService);

    beforeEach(() => jest.clearAllMocks());

    it('keeps the ranked order and exposes weekly aggregates', async () => {
        const { data, pagination } = await service.findTopRatedOfTheWeek({});

        expect(data.map((content) => content.id)).toEqual(['b', 'a', 'c']);
        expect(data[0].weeklyRating).toBe(4.8);
        expect(data[0].weeklyReviewsCount).toBe(9);
        expect(pagination).toEqual({ page: 1, limit: 4, totalItems: 3, totalPages: 1 });
    });

    it('flags wishlisted and favorited content for a logged user', async () => {
        const { data } = await service.findTopRatedOfTheWeek({}, 'user-1');

        expect(data.map((content) => content.isInWishlist)).toEqual([true, false, false]);
        expect(data.map((content) => content.isInFavorites)).toEqual([false, false, true]);
    });

    it('leaves the flags off for anonymous requests', async () => {
        const { data } = await service.findTopRatedOfTheWeek({});

        expect(data.every((content) => !content.isInWishlist && !content.isInFavorites)).toBe(true);
        expect(wishlistService.getWishlistedContentIds).not.toHaveBeenCalled();
    });

    it('defaults to 4 items per page', async () => {
        await service.findTopRatedOfTheWeek({});

        expect(queryBuilder.limit).toHaveBeenCalledWith(4);
        expect(queryBuilder.offset).toHaveBeenCalledWith(0);
    });
});
