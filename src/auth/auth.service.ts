import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    try {
      const { name, email, city, country, password } = createUserDto;

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          password: await bcrypt.hash(password, 10),
          city,
          country,
        },
      });

      console.log('User created', { email: user.email });
    } catch (error) {
      console.error(error)
      throw error instanceof ConflictException
        ? error
        : new InternalServerErrorException('an unknown error occurred');
    }
  }

  async loginUser(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (
        !user ||
        !(await this.encryptionService.comparePasswords(
          password,
          user.password,
        ))
      ) {
        throw new NotFoundException('user not found');
      }

      const payload = { userId: user.id, email: user.email };
      const token = this.jwtService.sign(payload);

      console.log('Login successful', token);

      return { message: 'Login successful', accessToken: token, id: user.id };
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('An unknown error occurred');
    }
  }
}
