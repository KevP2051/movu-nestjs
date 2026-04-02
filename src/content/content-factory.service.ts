import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ContentEntity } from './entities/content.entity';
import { MovieEntity } from '../movies/entities/movie.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { GenresService } from '../genres/genres.service';
import { ContentTypeEnum } from '../common/enums/content-type.enum';

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
                    genres,
                });
            } else {
                content = queryRunner.manager.create(ContentEntity, {
                    ...createContentDto,
                    genres,
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

            await queryRunner.commitTransaction();
            return movie;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Failed to create or update movie and content', error.message);
        } finally {
            await queryRunner.release();
        }
    }

}