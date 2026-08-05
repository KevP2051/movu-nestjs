import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, ObjectLiteral, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from 'src/users/entities/user.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { ContentEntity } from 'src/content/entities/content.entity';
import { WishlistEntity } from 'src/wishlist/entities/wishlist.entity';
import { FavoriteEntity } from 'src/favorite/entities/favorite.entity';
import { SeedUsersDto } from './dto/seed-users.dto';
import { SeedReviewsDto } from './dto/seed-reviews.dto';
import { SeedWishlistDto } from './dto/seed-wishlist.dto';
import { SeedFavoritesDto } from './dto/seed-favorites.dto';
import { SeedDatabaseDto } from './dto/seed-database.dto';

const SEED_EMAIL_DOMAIN = 'seed.movu.local';
export const SEED_DEFAULT_PASSWORD = 'Seed#1234';

@Injectable()
export class SeedService {

    private readonly logger = new Logger(SeedService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(ReviewEntity)
        private readonly reviewRepository: Repository<ReviewEntity>,
        @InjectRepository(ContentEntity)
        private readonly contentRepository: Repository<ContentEntity>,
        @InjectRepository(WishlistEntity)
        private readonly wishlistRepository: Repository<WishlistEntity>,
        @InjectRepository(FavoriteEntity)
        private readonly favoriteRepository: Repository<FavoriteEntity>,
        private readonly configService: ConfigService
    ) { }


    async seedUsers({ count = 10 }: SeedUsersDto) {

        this.ensureSeedingIsAllowed();

        const users = Array.from({ length: count }, (_, index) => this.buildFakeUser(index));

        const createdUsers = await this.userRepository.save(users);

        return {
            totalCreated: createdUsers.length,
            defaultPassword: SEED_DEFAULT_PASSWORD,
            message: `Successfully seeded ${createdUsers.length} users`
        };
    }

    async seedReviews({ count = 50 }: SeedReviewsDto) {

        this.ensureSeedingIsAllowed();

        const { users, contents } = await this.getUsersAndContentsOrThrow('reviews');

        const pairs = await this.buildUniqueUserContentPairs(count, users, contents, 'reviews');

        const reviews = pairs.map(({ user, content }) => this.buildFakeReview(user, content));

        const createdReviews = await this.reviewRepository.save(reviews);

        const contentsWithStatsUpdated = await this.recalculateContentRatingStats();

        return {
            totalCreated: createdReviews.length,
            contentsWithStatsUpdated,
            message: `Successfully seeded ${createdReviews.length} reviews`
        };
    }

    async seedWishlist({ count = 50 }: SeedWishlistDto) {

        this.ensureSeedingIsAllowed();

        const { users, contents } = await this.getUsersAndContentsOrThrow('wishlist items');

        const pairs = await this.buildUniqueUserContentPairs(count, users, contents, 'wishlist items');

        const wishlistItems = pairs.map(({ user, content }) =>
            this.wishlistRepository.create({ users: { id: user.id }, content: { id: content.id } })
        );

        const createdWishlistItems = await this.wishlistRepository.save(wishlistItems);

        return {
            totalCreated: createdWishlistItems.length,
            message: `Successfully seeded ${createdWishlistItems.length} wishlist items`
        };
    }

    async seedFavorites({ count = 50 }: SeedFavoritesDto) {

        this.ensureSeedingIsAllowed();

        const { users, contents } = await this.getUsersAndContentsOrThrow('favorites');

        const pairs = await this.buildUniqueUserContentPairs(count, users, contents, 'favorites');

        const favorites = pairs.map(({ user, content }) =>
            this.favoriteRepository.create({ users: { id: user.id }, content: { id: content.id } })
        );

        const createdFavorites = await this.favoriteRepository.save(favorites);

        return {
            totalCreated: createdFavorites.length,
            message: `Successfully seeded ${createdFavorites.length} favorites`
        };
    }

    async seedDatabase({ usersCount = 10, reviewsCount = 50, wishlistCount = 50, favoritesCount = 50 }: SeedDatabaseDto) {

        this.ensureSeedingIsAllowed();

        const usersResult = await this.seedUsers({ count: usersCount });
        const reviewsResult = await this.seedReviews({ count: reviewsCount });
        const wishlistResult = await this.seedWishlist({ count: wishlistCount });
        const favoritesResult = await this.seedFavorites({ count: favoritesCount });

        return {
            users: usersResult,
            reviews: reviewsResult,
            wishlist: wishlistResult,
            favorites: favoritesResult,
            message: 'Successfully seeded the database'
        };
    }

    async clearSeededData() {

        this.ensureSeedingIsAllowed();

        // A DELETE query builder drops any join but keeps the WHERE, so filtering
        // on a joined user alias produced invalid SQL. Resolve the seeded users
        // first, then delete their rows by foreign key.
        const seededUsers = await this.userRepository.find({
            where: { email: Like(`%@${SEED_EMAIL_DOMAIN}`) },
            select: { id: true }
        });

        if (seededUsers.length === 0) {
            return {
                deletedReviews: 0,
                deletedWishlistItems: 0,
                deletedFavorites: 0,
                deletedUsers: 0,
                contentsWithStatsUpdated: 0,
                message: 'There was no seeded data to clear'
            };
        }

        const userIds = seededUsers.map(({ id }) => id);

        const deletedReviews = await this.deleteByUserIds(this.reviewRepository, 'userId', userIds);
        const deletedWishlistItems = await this.deleteByUserIds(this.wishlistRepository, 'usersId', userIds);
        const deletedFavorites = await this.deleteByUserIds(this.favoriteRepository, 'usersId', userIds);

        const deletedUsers = await this.userRepository.delete({
            email: Like(`%@${SEED_EMAIL_DOMAIN}`)
        });

        const contentsWithStatsUpdated = await this.recalculateContentRatingStats();

        return {
            deletedReviews: deletedReviews.affected ?? 0,
            deletedWishlistItems: deletedWishlistItems.affected ?? 0,
            deletedFavorites: deletedFavorites.affected ?? 0,
            deletedUsers: deletedUsers.affected ?? 0,
            contentsWithStatsUpdated,
            message: 'Successfully cleared previously seeded data'
        };
    }

    private deleteByUserIds(repository: Repository<ObjectLiteral>, userColumn: string, userIds: string[]) {

        return repository
            .createQueryBuilder()
            .delete()
            .where(`"${userColumn}" IN (:...userIds)`, { userIds })
            .execute();
    }

    /**
     * Seeding writes reviews straight through the repository, bypassing
     * ReviewService, which is what keeps content.reviewsCount / averageRating
     * in sync. Recompute them from the reviews table instead.
     */
    private async recalculateContentRatingStats() {

        const stats = await this.reviewRepository
            .createQueryBuilder('review')
            .select('review.contentId', 'contentId')
            .addSelect('AVG(review.rating)', 'average')
            .addSelect('COUNT(review.id)', 'count')
            .groupBy('review.contentId')
            .getRawMany<{ contentId: string; average: string; count: string }>();

        await this.contentRepository
            .createQueryBuilder()
            .update()
            .set({ reviewsCount: 0, averageRating: 0 })
            .execute();

        // ponytail: one UPDATE per reviewed content, fine at seed volumes.
        // Switch to a single correlated-subquery UPDATE if it gets slow.
        for (const { contentId, average, count } of stats) {
            await this.contentRepository.update(contentId, {
                reviewsCount: Number(count),
                averageRating: Number(average)
            });
        }

        return stats.length;
    }

    private buildFakeUser(index: number): User {

        const uniqueSuffix = `${Date.now().toString(36)}${index}${faker.string.alphanumeric(4)}`.toLowerCase();

        return this.userRepository.create({
            userName: `seed${uniqueSuffix}`.slice(0, 16),
            email: `seed_${uniqueSuffix}@${SEED_EMAIL_DOMAIN}`,
            password: SEED_DEFAULT_PASSWORD,
            avatarUrl: faker.image.avatarGitHub(),
            roles: ['user'],
            isActive: true
        });
    }

    private buildFakeReview(user: User, content: ContentEntity): ReviewEntity {

        return this.reviewRepository.create({
            title: faker.lorem.sentence({ min: 3, max: 8 }),
            description: faker.lorem.paragraph({ min: 1, max: 3 }),
            rating: faker.number.int({ min: 1, max: 5 }),
            user: { id: user.id },
            content: { id: content.id }
        });
    }

    private async getUsersAndContentsOrThrow(entityLabel: string) {

        const [users, contents] = await Promise.all([
            this.userRepository.find(),
            this.contentRepository.find()
        ]);

        if (users.length === 0) {
            throw new BadRequestException(`There are no users in the database yet. Seed users before seeding ${entityLabel}.`);
        }

        if (contents.length === 0) {
            throw new BadRequestException(`There is no content in the database yet. Sync content (see tmdb-sync) before seeding ${entityLabel}.`);
        }

        return { users, contents };
    }

    private async buildUniqueUserContentPairs(count: number, users: User[], contents: ContentEntity[], entityLabel: string) {

        const maxPossiblePairs = users.length * contents.length;
        const totalToCreate = Math.min(count, maxPossiblePairs);

        if (totalToCreate < count) {
            this.logger.warn(
                `Requested ${count} ${entityLabel} but only ${maxPossiblePairs} unique user/content combinations are available. Creating ${totalToCreate} instead.`
            );
        }

        const usedCombinations = new Set<string>();
        const pairs: { user: User; content: ContentEntity }[] = [];

        while (pairs.length < totalToCreate) {

            const user = faker.helpers.arrayElement(users);
            const content = faker.helpers.arrayElement(contents);
            const combinationKey = `${user.id}-${content.id}`;

            if (usedCombinations.has(combinationKey)) continue;

            usedCombinations.add(combinationKey);
            pairs.push({ user, content });
        }

        return pairs;
    }

    private ensureSeedingIsAllowed() {

        const environment = this.configService.get('app.environment');

        if (environment === 'prod' || environment === 'production') {
            throw new ForbiddenException('Database seeding is disabled in production environments');
        }
    }
}
