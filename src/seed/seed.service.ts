import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from 'src/users/entities/user.entity';
import { Review } from 'src/review/entities/review.entity';
import { ContentEntity } from 'src/content/entities/content.entity';
import { SeedUsersDto } from './dto/seed-users.dto';
import { SeedReviewsDto } from './dto/seed-reviews.dto';
import { SeedDatabaseDto } from './dto/seed-database.dto';

const SEED_EMAIL_DOMAIN = 'seed.movu.local';
export const SEED_DEFAULT_PASSWORD = 'Seed#1234';

@Injectable()
export class SeedService {

    private readonly logger = new Logger(SeedService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(ContentEntity)
        private readonly contentRepository: Repository<ContentEntity>,
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

        const [users, contents] = await Promise.all([
            this.userRepository.find(),
            this.contentRepository.find()
        ]);

        if (users.length === 0) {
            throw new BadRequestException('There are no users in the database yet. Seed users before seeding reviews.');
        }

        if (contents.length === 0) {
            throw new BadRequestException('There is no content in the database yet. Sync content (see tmdb-sync) before seeding reviews.');
        }

        const maxPossibleReviews = users.length * contents.length;
        const totalToCreate = Math.min(count, maxPossibleReviews);

        if (totalToCreate < count) {
            this.logger.warn(
                `Requested ${count} reviews but only ${maxPossibleReviews} unique user/content combinations are available. Creating ${totalToCreate} instead.`
            );
        }

        const usedCombinations = new Set<string>();
        const reviews: Review[] = [];

        while (reviews.length < totalToCreate) {

            const user = faker.helpers.arrayElement(users);
            const content = faker.helpers.arrayElement(contents);
            const combinationKey = `${user.id}-${content.id}`;

            if (usedCombinations.has(combinationKey)) continue;

            usedCombinations.add(combinationKey);
            reviews.push(this.buildFakeReview(user, content));
        }

        const createdReviews = await this.reviewRepository.save(reviews);

        return {
            totalCreated: createdReviews.length,
            message: `Successfully seeded ${createdReviews.length} reviews`
        };
    }

    async seedDatabase({ usersCount = 10, reviewsCount = 50 }: SeedDatabaseDto) {

        this.ensureSeedingIsAllowed();

        const usersResult = await this.seedUsers({ count: usersCount });
        const reviewsResult = await this.seedReviews({ count: reviewsCount });

        return {
            users: usersResult,
            reviews: reviewsResult,
            message: 'Successfully seeded the database'
        };
    }

    async clearSeededData() {

        this.ensureSeedingIsAllowed();

        const deletedReviews = await this.reviewRepository
            .createQueryBuilder('review')
            .leftJoin('review.user', 'user')
            .where('user.email LIKE :emailPattern', { emailPattern: `%@${SEED_EMAIL_DOMAIN}` })
            .delete()
            .execute();

        const deletedUsers = await this.userRepository.delete({
            email: Like(`%@${SEED_EMAIL_DOMAIN}`)
        });

        return {
            deletedReviews: deletedReviews.affected ?? 0,
            deletedUsers: deletedUsers.affected ?? 0,
            message: 'Successfully cleared previously seeded data'
        };
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

    private buildFakeReview(user: User, content: ContentEntity): Review {

        return this.reviewRepository.create({
            title: faker.lorem.sentence({ min: 3, max: 8 }),
            description: faker.lorem.paragraph({ min: 1, max: 3 }),
            rating: faker.number.int({ min: 1, max: 5 }),
            user: { id: user.id },
            content: { id: content.id }
        });
    }

    private ensureSeedingIsAllowed() {

        const environment = this.configService.get('app.environment');

        if (environment === 'prod' || environment === 'production') {
            throw new ForbiddenException('Database seeding is disabled in production environments');
        }
    }
}
