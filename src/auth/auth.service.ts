import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(authDto: AuthDto) {
    const hashed = await argon2.hash('myPassword');
    const user = await this.prismaService.user.create({
      data: {
        email: authDto.email,
        password: hashed,
      },
    });
    return { message: 'User signed up successfully', user: user.email };
  }
}
