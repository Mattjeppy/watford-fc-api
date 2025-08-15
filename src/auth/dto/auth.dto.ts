import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'password is too weak',
  })
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}
