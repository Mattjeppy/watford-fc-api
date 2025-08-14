import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  async signup(authDto: AuthDto) {
    const user = await PrismaService.user.create({
      data: {
        email: authDto.email,
        password: authDto.password,
      },
    });
    return { message: 'User signed up successfully', user };
  }
}
