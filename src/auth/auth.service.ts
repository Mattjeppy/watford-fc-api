import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async signup(authDto: AuthDto) {
    const hashedPw = await argon2.hash(authDto.password);
    const email = authDto.email.toLowerCase();
    const user = await this.prismaService.user.create({
      data: { email, password: hashedPw },
    });
    return { message: 'User signed up successfully', user: user.email };
  }

  async signin(authDto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: authDto.email.toLowerCase() },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const verified = await argon2.verify(user.password, authDto.password);
    if (!verified) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}

