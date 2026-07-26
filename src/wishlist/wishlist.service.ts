import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new Error('Content already in wishlist');
    }

    const wishlist = this.wishlistRepository.create({ ...createWishlistDto, users: { id: userId } });

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

  async findOne(userId: string, id: string) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: id, users: { id: userId } },
      relations: {
        content: true
      }
    });

    return wishlist;
  }

  async remove(userId: string, id: string) {

    const wishlist = await this.findOne(userId, id);

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with id ${id} not found`);
    }

    return await this.wishlistRepository.delete({ id: id });

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
