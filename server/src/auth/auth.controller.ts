import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleLogin(@Body('token') token: string) {
    // const user = await this.authService.verifyGoogleToken(token);
    // return { message: 'Login successful', user };  // You can add JWT generation or other logic here

    const googlePayload = await this.authService.verifyGoogleToken(token);
    const user = await this.authService.loginOrSignup(googlePayload);
    return { message: 'Login successful', user };
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token)
  }
}
