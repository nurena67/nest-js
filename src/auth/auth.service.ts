import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repositoriy';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async register(username: string, passwordHash: string): Promise<User> {
    return this.userRepository.createUser(username, passwordHash);
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(
    username: string,
    password: string
  ): Promise<{ accessToken: string }> {
    const user = await this.validateUser(username, password);
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
