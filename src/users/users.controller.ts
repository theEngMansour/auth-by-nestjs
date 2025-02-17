import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { RegisterDto } from '@/users/dtos/register.dto';
import { LoginDto } from '@/users/dtos/login.dto';
import { AccessTokenType, JWTPayLoadType } from '@/utils/type';
import { UserEntity } from '@/users/user.entity';
import { AuthGuard } from '@/users/guards/auth.guard';
import { CurrentUser } from '@/users/decorators/current-user.decorator';
import { Roles } from '@/users/decorators/user-role.decorator';
import { UserType } from '@/utils/constant';
import { AuthRolesGuard } from '@/users/guards/auth-roles.guard';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth/register')
  public async register(@Body() body: RegisterDto): Promise<AccessTokenType> {
    return await this.usersService.register(body);
  }

  @Post('/auth/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() body: LoginDto): Promise<AccessTokenType> {
    return await this.usersService.login(body);
  }

  @Get('/current-user')
  @UseGuards(AuthGuard)
  public async getCurrentUser(
    @CurrentUser() payload: JWTPayLoadType,
  ): Promise<UserEntity | null> {
    return await this.usersService.getCurrentUser(payload.id);
  }

  @Get()
  @Roles(UserType.USER)
  @UseGuards(AuthRolesGuard)
  public async getAllUsers(): Promise<UserEntity[]> {
    return await this.usersService.getAllUsers();
  }
}
