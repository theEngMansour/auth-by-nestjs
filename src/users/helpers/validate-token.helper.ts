import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWTPayLoadType } from '@/utils/type';
import { CURRENT_USER_KEY } from '@/utils/constant';

export class ValidateTokenHelper {
  constructor(
    public readonly jwtService: JwtService,
    public readonly configService: ConfigService,
  ) {}

  public async validateToken(request: Request): Promise<JWTPayLoadType> {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (!token || type !== 'Bearer') {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload: JWTPayLoadType = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      request[CURRENT_USER_KEY] = payload;
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
