import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ValidateTokenHelper } from '@/users/helpers/validate-token.helper';

@Injectable()
export class AuthGuard extends ValidateTokenHelper implements CanActivate {
  constructor(
    public readonly jwtService: JwtService,
    public readonly configService: ConfigService,
  ) {
    super(jwtService, configService);
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    await this.validateToken(request);
    return true;
  }
}
