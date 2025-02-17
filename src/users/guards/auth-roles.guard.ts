import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWTPayLoadType } from '@/utils/type';
import { UserType } from '@/utils/constant';
import { Reflector } from '@nestjs/core';
import { UsersService } from '@/users/users.service';
import { UserEntity } from '@/users/user.entity';
import { ValidateTokenHelper } from '@/users/helpers/validate-token.helper';

@Injectable()
export class AuthRolesGuard extends ValidateTokenHelper implements CanActivate {
  constructor(
    public readonly jwtService: JwtService,
    public readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {
    super(jwtService, configService);
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserType[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length == 0) return false;

    const request: Request = context.switchToHttp().getRequest();
    const payload: JWTPayLoadType = await this.validateToken(request);
    const user: UserEntity | null = await this.usersService.getCurrentUser(
      payload.id,
    );

    return !!(user && roles.includes(user.userType));
  }
}
