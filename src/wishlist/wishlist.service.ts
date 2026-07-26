import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class WishlistService {

  constructor(
    @InjectRepository(WishlistEntity)
    private readonly wishlistRepository: Repository<WishlistEntity>
  ) { }

  async create(userId: string, createWishlistDto: CreateWishlistDto) {

    const existingWishlist = await this.findOne(userId, createWishlistDto.contentId);

    if (existingWishlist) {
      throw new ConflictException('Content already in wishlist');
    }

    // La entidad expone la relación `content`, no una columna `contentId`:
    // pasar el dto tal cual hacía que TypeORM lo ignorara y guardara content = NULL.
    const wishlist = this.wishlistRepository.create({
      content: { id: createWishlistDto.contentId },
      users: { id: userId }
    });

    return await this.wishlistRepository.save(wishlist);
  }

  async findAllByUser(userId: string) {

    const wishlists = this.wishlistRepository.find({
      where: {
        users: { id: userId }
      },
      relations: {
        content: true
      }
    });

    return wishlists;
  }

  // Se busca por contenido, no por id de fila: el cliente solo conoce el contentId.
  async findOne(userId: string, contentId: string) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { content: { id: contentId }, users: { id: userId } },
      relations: {
        content: true
      }
    });

    return wishlist;
  }

  async remove(userId: string, contentId: string) {

    const wishlist = await this.findOne(userId, contentId);

    if (!wishlist) {
      throw new NotFoundException(`Content ${contentId} is not in the wishlist`);
    }

    return await this.wishlistRepository.delete({ id: wishlist.id });

  }

  async isContentInWishlist(userId: string, contentId: string): Promise<boolean> {
    const count = await this.wishlistRepository.count({
      where: { users: { id: userId }, content: { id: contentId } }
    });

    return count > 0;
  }

  async getWishlistedContentIds(userId: string, contentIds: string[]): Promise<Set<string>> {
    if (contentIds.length === 0) {
      return new Set();
    }

    // Solo necesitamos el id del contenido, no hidratamos toda la entidad.
    const wishlists = await this.wishlistRepository.find({
      where: { users: { id: userId }, content: { id: In(contentIds) } },
      select: { id: true, content: { id: true } },
      relations: { content: true }
    });

    return new Set(wishlists.map((wishlist) => wishlist.content.id));
  }
}
