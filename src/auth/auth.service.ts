import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(authDto: AuthDto) {
    const user = await this.prismaService.user.create({
      data: {
        email: authDto.email,
        password: authDto.password,
      },
    });
    return { message: 'User signed up successfully', user };
  }
}
