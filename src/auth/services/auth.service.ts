import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/services/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/repository/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string): Promise<string> {
    console.log('Email yang diterima:', email);
    console.log('Password yang diterima:', password);

    if (!email || !password) {
      throw new UnauthorizedException('Email dan password harus diisi');
    }

    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  async register(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<User> {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }
    console.log('Password sebelum hashing:', password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password setelah hashing:', hashedPassword);
    return this.userService.createUser(name, email, hashedPassword, role);
  }

  logout(): void {
    // Logout logic (if needed, e.g., blacklisting token)
  }
}
