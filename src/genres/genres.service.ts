import { Inject, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreEntity } from './entities/genre.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';

@Injectable()
export class GenresService {

  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>

  ) { }


  //TODO: Surround by a try-catch block to handle potential errors during database operations
  async createOrUpdateGenre(genreData: CreateGenreDto) {

    const existingGenre = await this.genreRepository.findOneBy({ tmdbId: genreData.tmdbId });

    if (existingGenre) {
      return this.genreRepository.save({ ...existingGenre, ...genreData });
    }

    const genre = this.genreRepository.create(genreData);
    await this.genreRepository.save(genre);

  }

  findAll() {
    return this.genreRepository.find();
  }

  findAllByType(contentType: ContentTypeEnum) {
    return this.genreRepository.find({ where: { contentType } });
  }

  findAllByTmdbIds(tmdbIds: number[], contentType: ContentTypeEnum) {
    return this.genreRepository.find({ where: { tmdbId: In(tmdbIds), contentType } });
  }

  findOneByType(tmdbId: number, contentType: ContentTypeEnum) {
    return this.genreRepository.findOneBy({ tmdbId: tmdbId, contentType: contentType });
  }

  update(tmdbId: number, contentType: ContentTypeEnum, updateGenreDto: UpdateGenreDto) {
    return this.genreRepository.update({ tmdbId, contentType }, updateGenreDto);
  }


}
