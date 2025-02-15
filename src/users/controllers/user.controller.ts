import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ResponseFormat } from '../../interface/response.interface';
import { User } from '../repository/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/guards/roles';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async getAllUsers(): Promise<ResponseFormat<User[]>> {
    const users = await this.userService.getAllUsers();
    return {
      status: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<ResponseFormat<User>> {
    const user = await this.userService.getUserById(parseInt(id));
    return {
      status: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async createUser(
    @Body() body: { email: string; password: string; role: string }
  ): Promise<ResponseFormat<User>> {
    const user = await this.userService.createUser(
      body.email,
      body.password,
      body.role
    );
    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { email: string; password: string }
  ): Promise<ResponseFormat<User>> {
    const user = await this.userService.updateUser(
      parseInt(id),
      body.email,
      body.password
    );
    return {
      status: HttpStatus.OK,
      message: 'User updated successfully',
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<ResponseFormat<null>> {
    await this.userService.deleteUser(parseInt(id));
    return {
      status: HttpStatus.OK,
      message: 'User deleted successfully',
      data: null,
    };
  }
}
