import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteEntity } from './entities/favorite.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class FavoriteService {

  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favoriteRepository: Repository<FavoriteEntity>
  ) { }

  async create(userId: string, createFavoriteDto: CreateFavoriteDto) {

    const existingFavorite = await this.findOne(userId, createFavoriteDto.contentId);

    if (existingFavorite) {
      throw new Error('Content already in favorites');
    }

    const favorite = this.favoriteRepository.create({ ...createFavoriteDto, users: { id: userId } });

    return await this.favoriteRepository.save(favorite);
  }

  async findAllByUser(userId: string) {

    const favorites = this.favoriteRepository.find({
      where: {
        users: { id: userId }
      },
      relations: {
        content: true
      }
    });

    return favorites;
  }

  async findOne(userId: string, id: string) {
    const favorite = await this.favoriteRepository.findOne({
      where: { id: id, users: { id: userId } },
      relations: {
        content: true
      }
    });

    return favorite;
  }

  async remove(userId: string, id: string) {

    const favorite = await this.findOne(userId, id);

    if (!favorite) {
      throw new NotFoundException(`Favorite with id ${id} not found`);
    }

    return await this.favoriteRepository.delete({ id: id });

  }

  async isContentInFavorites(userId: string, contentId: string): Promise<boolean> {
    const count = await this.favoriteRepository.count({
      where: { users: { id: userId }, content: { id: contentId } }
    });

    return count > 0;
  }

  async getFavoritedContentIds(userId: string, contentIds: string[]): Promise<Set<string>> {
    if (contentIds.length === 0) {
      return new Set();
    }

    // Solo necesitamos el id del contenido, no hidratamos toda la entidad.
    const favorites = await this.favoriteRepository.find({
      where: { users: { id: userId }, content: { id: In(contentIds) } },
      select: { id: true, content: { id: true } },
      relations: { content: true }
    });

    return new Set(favorites.map((favorite) => favorite.content.id));
  }
}
