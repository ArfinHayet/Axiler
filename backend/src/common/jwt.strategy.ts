// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Read from Bearer token
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: process.env.JWT_SECRET, // Should come from process.env
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, name: payload.username, role: payload.role };
  }
}
