import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
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

  //TODO: Update user info
  async update(id: string, updateUserDto: UpdateUserDto) {
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

  private handleDbErrors(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check server logs.');
  }
}
