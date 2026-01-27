import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth, GetUser } from './decorators';
import { User } from 'src/users/entities/user.entity';
import { CompletePasswordResetDto, RequestPasswordResetDto, VerifyPasswordResetDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto:LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkStatus(@GetUser() user:User) {
    return this.authService.checkStatus(user);
  }

  @Post('reset-password/request')
  requestResetPassword(@Body() email:RequestPasswordResetDto) {
    //TODO: Dto for body
    //TODO: Token invalidation logic
    //TODO: Send email with reset instructions

  }

  @Post('reset-password/verify')
  confirmResetPassword(@Body() body: VerifyPasswordResetDto) {
    //TODO : Dto for body
    //TODO: Verify token and code
    
  }

  @Post('reset-password/complete')
  completeResetPassword(@Body() body: CompletePasswordResetDto) {
    //TODO : Dto for body
    //TODO: Complete password reset process
  }

}
