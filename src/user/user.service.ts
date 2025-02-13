import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/auth/repositories/user.repositoriy';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne(id);
  }
}
