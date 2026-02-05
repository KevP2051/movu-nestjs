import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CompletePasswordResetDto, LoginUserDto, RequestPasswordResetDto, VerifyPasswordResetDto } from './dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationCode } from './entities/verification-code.entity';
import { MoreThan, Repository } from 'typeorm';
import { UpdateUserDto } from 'src/users/dto';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepository: Repository<VerificationCode>,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService
  ) {
  }



  async registerUser(createUserDto: CreateUserDto) {

    const user = await this.usersService.create(createUserDto);


    await this.emailService.sendWelcomeEmail(user!.email, user!.fullName);


    return { user, token: this.getJwtToken(user!.id) };


  }

  async loginUser(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.usersService.findByEmailForAuth(email);

    if (!user) {
      throw new BadRequestException('Credentials are not valid');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Credentials are not valid');
    }


    const { password: passwordToDelete, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: this.getJwtToken(user.id)
    }

  }

  checkStatus(user: User) {

    return {
      user,
      token: this.getJwtToken(user.id)
    }


  }

  // Password Reset Request

  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto) {

    try {

      const { email } = requestPasswordResetDto;

      const user = await this.usersService.findOne(email);

      if (!user) {
        throw new BadRequestException('User with specified email does not exist');
      }

      await this.verifyRecentCodesExistence(email);
      const verificationCode = await this.createVerificationCode(user);

      await this.emailService.sendPasswordResetEmail(email, user.fullName, verificationCode.code);
      return { message: 'Verification code sent to email' };



    } catch (error) {
      console.log(error)

      throw new InternalServerErrorException('Failed to process password reset request, check server logs for more details');
    }

  }

  private async verifyRecentCodesExistence(email: string) {
    const recentCode = await this.verificationCodeRepository.findOne({
      where: {
        email: email,
        used: false,
        createdAt: MoreThan(new Date(Date.now() - 2 * 60 * 1000))
      }
    });
    if (recentCode) {
      throw new BadRequestException('A recent verification code has already been sent. Please wait before requesting a new one.');
    }
  }


  private async createVerificationCode(user: User) {

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const createdAt = new Date();
    const verificationCode = this.verificationCodeRepository.create({
      code,
      createdAt,
      expiresAt,
      user,
      email: user.email
    });

    await this.verificationCodeRepository.save(verificationCode);

    return { code: verificationCode.code }
  }

  //Password Reset Verification

  async verifyResetCode(verifyPasswordResetDto: VerifyPasswordResetDto) {

    const verificationCode = await this.getResetCode(verifyPasswordResetDto);

    return { message: 'Verification successful' };

  }


  private async getResetCode(verifyPasswordResetDto: VerifyPasswordResetDto) {
    try {
      const { email, code } = verifyPasswordResetDto;

      const verificationCode = await this.verificationCodeRepository.findOne({
        where: {
          email: email,
          code: code,
          used: false,
          expiresAt: MoreThan(new Date())
        },
        relations: ['user']
      });

      if (!verificationCode) {
        throw new BadRequestException('Invalid or expired verification code');
      }

      return verificationCode;

    } catch (error) {

      throw new InternalServerErrorException('Failed to verify code, check server logs for more details');

    }
  }


  async completePasswordReset(completePasswordResetDto: CompletePasswordResetDto) {
    try {
      const { email, newPassword, code } = completePasswordResetDto;

      const verificationCode = await this.getResetCode({ email, code });

      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      await this.usersService.updatePassword(verificationCode.user.id, hashedPassword);

      verificationCode.used = true;
      await this.verificationCodeRepository.save(verificationCode);

      await this.emailService.sendPasswordChangeEmail(email, verificationCode.user.fullName);

      return { message: 'Password updated successfully' };

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update password, check server logs for more details');
    }
  }



  private getJwtToken(id: string) {
    return this.jwtService.sign({
      id: id
    });
  }

}
