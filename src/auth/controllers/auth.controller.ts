import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ResponseFormat } from '../../interface/response.interface';
import { User } from '../../users/repository/user.entity';
import { JwtAuthGuard } from '../guards/auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string }
  ): Promise<ResponseFormat<{ access_token: string }>> {
    const accessToken = await this.authService.login(body.email, body.password);
    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      data: { access_token: accessToken },
    };
  }

  @Post('register')
  async register(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      role: string;
    }
  ): Promise<ResponseFormat<User>> {
    const user = await this.authService.register(
      body.name,
      body.email,
      body.password,
      body.role
    );
    return {
      status: HttpStatus.CREATED,
      message: 'Registration successful',
      data: user,
    };
  }

  @Post('logout')
  logout(): ResponseFormat<null> {
    this.authService.logout();
    return {
      status: HttpStatus.OK,
      message: 'Logged out successfully',
      data: null,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request): ResponseFormat<User> {
    return {
      status: HttpStatus.OK,
      message: 'User profile retrieved successfully',
      data: req.user as User, // Data user yang didapat dari token JWT
    };
  }
}
