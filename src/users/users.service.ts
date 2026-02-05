import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryBuilder, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { getSearchField } from 'src/common/helpers/search-field.helper';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) {
  }


  async create(createUserDto: CreateUserDto) {
    try {
      const { ...userData } = this.userRepository.create(createUserDto);
      const user = this.userRepository.create({
        ...userData
      });

      await this.userRepository.save(user);

      const { password: userPassword, ...userWithoutPassword } = user;
      return userWithoutPassword;

    } catch (error) {

      this.handleDbErrors(error);

    }

  }

  async findAll() {

    const users = await this.userRepository.find();

    return users;
  }

  async findOne(term: string) {

    const searchField = getSearchField(term);
    const user = await this.userRepository.findOneBy({ [searchField]: term })

    if (!user) {
      throw new NotFoundException(`User not found with specified ${[searchField]}`);
    }

    return user;

  }

  async findByEmailForAuth(email: string) {

    const user = await this.userRepository.findOne({
      where: { email: email },
      select: { id: true, email: true, password: true }
    })

    if (!user) throw new NotFoundException(`User with email ${email} not found`);

    return user;

  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {

      const user = await this.userRepository.preload({ id: id, ...updateUserDto });
      if (!user) throw new NotFoundException(`User with ${id} not found`);

      await this.userRepository.save(user);
      return user;

    } catch (error) {

      this.handleDbErrors(error);

    }

  }

  //TODO: Remove user
  remove(id: string) {
    const user = this.findOne(id);
    this.userRepository.delete(id);
  }

  async updatePassword(id: string, newHashedPassword: string) {
    try {
      const user = await this.userRepository.preload({ id: id, password: newHashedPassword });
      if (!user) throw new NotFoundException(`User with ${id} not found`);

      await this.userRepository.save(user);

      return user;
    } catch (error) {
      this.handleDbErrors(error);
    }

  }

  private handleDbErrors(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check server logs.');
  }
}
