import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

  constructor(private readonly usersService: UsersService) {
  }



  async registerUser(createUserDto: CreateUserDto) {

    return await this.usersService.create(createUserDto);

  }

  async loginUser(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.usersService.findByEmailForAuth(email);

    if (!user) {
      throw new BadRequestException('Credentials are not valid');
    }

    if (bcrypt.compareSync(password, user.password)) {



    }
  }

  signJwt(id: string) {
    
  }

}
