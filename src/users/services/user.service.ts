import * as bcrypt from 'bcrypt';
import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../repository/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'role'],
    });
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async createUser(
    name: string,
    email: string,
    hashedPassword: string,
    role: string
  ) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return this.userRepository.save(user);
  }

  async updateUser(id: number, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.update(id, { email, password: hashedPassword });
    return this.getUserById(id);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    console.log('User ditemukan:', user);

    if (!user) return null;

    console.log('Password dari request:', password);
    console.log('Password hash di database:', user.password);

    if (!password || !user.password) {
      throw new UnauthorizedException('Password tidak valid');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) return null;

    return user;
  }
}
