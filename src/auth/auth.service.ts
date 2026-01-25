import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {
  }



  async registerUser(createUserDto: CreateUserDto) {

    const user = await this.usersService.create(createUserDto);

    return {user, token: this.getJwtToken(user!.id)};


  }

  async loginUser(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.usersService.findByEmailForAuth(email);

    if (!user) {
      throw new BadRequestException('Credentials are not valid');
    }

    if(!bcrypt.compareSync(password, user.password)){
      throw new BadRequestException('Credentials are not valid');
    }
 

    const { password: passwordToDelete, ...userWithoutPassword } = user;

    return{
      user: userWithoutPassword,
      token: this.getJwtToken(user.id)
    }

  }

  getJwtToken(id:string){
   return this.jwtService.sign({
      id: id
    });
  }

}
