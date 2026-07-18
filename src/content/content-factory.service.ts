import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ContentEntity } from './entities/content.entity';
import { MovieEntity } from '../movies/entities/movie.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { CreateContentCreditDto } from './dto/create-content-credit.dto';
import { GenresService } from '../genres/genres.service';
import { ContentTypeEnum } from '../common/enums/content-type.enum';
import { PersonEntity } from '../person/entities/person.entity';
import { ContentCreditEntity } from './entities/content-credit';
import slugify from 'slugify';

@Injectable()
export class ContentFactoryService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly genresService: GenresService,
    ) { }

    async createOrUpdateMovieWithContent(createContentDto: CreateContentDto) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const genres = await this.genresService.findAllByTmdbIds(
                createContentDto.genreIds!,
                createContentDto.type || ContentTypeEnum.MOVIE,
            );

            let content = await queryRunner.manager.findOne(ContentEntity, {
                where: { tmdbId: createContentDto.tmdbId },
                relations: ['genres'],
            });

            if (content) {
                queryRunner.manager.merge(ContentEntity, content, {
                    ...createContentDto,
                    genres
                });

            } else {
                content = queryRunner.manager.create(ContentEntity, {
                    ...createContentDto,
                    genres,
                    slug: slugify(createContentDto.title, { lower: true, strict: true }),
                });
            }
            const savedContent = await queryRunner.manager.save(content);

            let movie = await queryRunner.manager.findOne(MovieEntity, {
                where: { id: savedContent.id as any },
            });

            if (!movie) {
                movie = queryRunner.manager.create(MovieEntity, {
                    id: savedContent.id as any,
                    content: savedContent,
                });
                movie = await queryRunner.manager.save(movie);
            }

            for (const credit of createContentDto.credits || []) {
                await this.createOrUpdateCredit(queryRunner.manager, savedContent, credit);
            }

            await queryRunner.commitTransaction();
            return movie;
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Failed to create or update movie and content', error.message);
        } finally {
            await queryRunner.release();
        }
    }

    private async createOrUpdateCredit(
        manager: EntityManager,
        content: ContentEntity,
        credit: CreateContentCreditDto,
    ) {
        let person = await manager.findOne(PersonEntity, {
            where: { tmdbId: credit.person.tmdbId },
        });

        if (person) {
            manager.merge(PersonEntity, person, credit.person);
        } else {
            person = manager.create(PersonEntity, credit.person);
        }
        person = await manager.save(person);

        let contentCredit = await manager.findOne(ContentCreditEntity, {
            where: { content: { id: content.id }, person: { id: person.id } },
        });

        if (contentCredit) {
            manager.merge(ContentCreditEntity, contentCredit, { character: credit.character });
        } else {
            contentCredit = manager.create(ContentCreditEntity, {
                character: credit.character,
                person,
                content,
            });
        }
        await manager.save(contentCredit);
    }

}