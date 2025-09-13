// auth.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { isEmail } from 'class-validator';
import { User } from 'src/users/repository/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }




  async validateUser(password: string,compare_password: string): Promise<boolean | null> {
    const isMatch = await bcrypt.compare(password, compare_password);
    return isMatch ? true : null;
  }


  async login(user: User): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    // Generate access token (short-lived, e.g., 15m)
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,  
      expiresIn: '15m',
    });

    // Generate refresh token (longer-lived, e.g., 7d)
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

}
