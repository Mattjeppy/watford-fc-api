import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(authDto: AuthDto) {
    const hashedPw = await argon2.hash(authDto.password);
    const email = authDto.email.toLowerCase();
    const user = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPw,
      },
    });
    return { message: 'User signed up successfully', user: user.email };
  }

  async signin(authDto: AuthDto) {
    //TODO: set up JWT service
    const user = await this.prismaService.user.findUnique({ where: { email: authDto.email.toLowerCase() } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const verifiedUser = await argon2.verify(user.password, authDto.password);
    if (!verifiedUser) throw new UnauthorizedException('Invalid credentials');

    return { message: 'User signed in successfully', user: user.email };
  }
}
