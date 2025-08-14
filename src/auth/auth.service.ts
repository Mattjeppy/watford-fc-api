import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  signup(authDto: AuthDto) {
    return { message: 'User signed up successfully', user: authDto };
  }
}
