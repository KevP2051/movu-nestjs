import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentEntity } from './entities/content.entity';
import { Repository } from 'typeorm';
import { GenresService } from 'src/genres/genres.service';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';

@Injectable()
export class ContentService {

  constructor(
    @InjectRepository(ContentEntity)
    private readonly contentRepository: Repository<ContentEntity>,
    private readonly genresService: GenresService
  ) { }


  async create(createContentDto: CreateContentDto) {

    const genres = await this.genresService.findAllByTmdbIds(createContentDto.genreIds!, createContentDto.type!);

    const content = this.contentRepository.create({ ...createContentDto, genres: genres });
    return await this.contentRepository.save(content);

  }


  async getHomeContent(contentType: ContentTypeEnum) {

    const genres = await this.genresService.findAllByType(contentType);

    const contentByGenre = await Promise.all(genres.map(async (genre) => {
      const content = await this.contentRepository.createQueryBuilder('content')
        .leftJoinAndSelect('content.genres', 'genres')
        .where('genres.id = :genreId', { genreId: genre.id })
        .andWhere('content.type = :contentType', { contentType })
        .getMany();

      return {
        genre: genre.name,
        content: content
      };

    }));

    return { contentByGenre };

  }


  findAll() {
    return `This action returns all content`;
  }

  async findOne(contentId: string) {
    try {
      const content = await this.contentRepository.findOne({ where: { id: contentId } });
      if (!content) {
        throw new NotFoundException('Content not found');
      }
      return content;
    } catch (error) {

    }

  }

  update(id: number, updateContentDto: UpdateContentDto) {
    return `This action updates a #${id} content`;
  }

  remove(id: number) {
    return `This action removes a #${id} content`;
  }

  findReviewsByContent(contentId: string) {

  }
}
