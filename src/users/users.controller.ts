import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { RegisterDto } from '@/users/dtos/register.dto';
import { LoginDto } from '@/users/dtos/login.dto';
import { JWTPayLoadType } from '@/utils/type';
import { UserEntity } from '@/users/user.entity';
import { AuthGuard } from '@/users/guards/auth.guard';
import { CurrentUser } from '@/users/decorators/current-user.decorator';
import { Roles } from '@/users/decorators/user-role.decorator';
import { UserType } from '@/utils/constant';
import { AuthRolesGuard } from '@/users/guards/auth-roles.guard';
import { UpdateDto } from '@/users/dtos/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerImageConfig } from '@/config/multer-image.config';
import { ForgotPasswordDto } from '@/users/dtos/forgot-password.dto';
import { ResetPasswordDto } from '@/users/dtos/reset-password.dto';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth/register')
  public async register(@Body() body: RegisterDto) {
    return await this.usersService.register(body);
  }

  @Post('/auth/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() body: LoginDto) {
    return await this.usersService.login(body);
  }

  @Get('/current-user')
  @UseGuards(AuthGuard)
  // @UseInterceptors(ClassSerializerInterceptor)
  // @UseInterceptors(LoggingInterceptor)
  public async getCurrentUser(
    @CurrentUser() payload: JWTPayLoadType,
  ): Promise<UserEntity | null> {
    return await this.usersService.getCurrentUser(payload.id);
  }

  @Get()
  @Roles(UserType.USER)
  @UseGuards(AuthRolesGuard)
  public async getAllUsers(
    @Query('type') type: string,
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('total', ParseIntPipe) total: number,
  ): Promise<UserEntity[]> {
    return await this.usersService.getAllUsers(type, pageNumber, total);
  }

  @Put()
  @Roles(UserType.USER, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async updateUser(
    @CurrentUser() payload: JWTPayLoadType,
    @Body() body: UpdateDto,
  ): Promise<UserEntity> {
    return await this.usersService.update(payload.id, body);
  }

  @Delete(':id')
  @Roles(UserType.USER, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JWTPayLoadType,
  ) {
    return await this.usersService.delete(id, payload);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file', multerImageConfig))
  @UseGuards(AuthGuard)
  public uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() payload: JWTPayLoadType,
  ) {
    if (!file) throw new BadRequestException('no upload any file');
    return this.usersService.setProfileImage(payload.id, file.filename);
  }

  @Get('/verify-email/:id/:verificationToken')
  public verifyEmail(
    @Param('id', ParseIntPipe) id: number,
    @Param('verificationToken') verificationToken: string,
  ): Promise<{ message: string }> {
    return this.usersService.verifyEmail(id, verificationToken);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  public forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.usersService.sendResetPassword(body.email);
  }

  @Get('reset-password/:id/:resetPasswordToken')
  public getResetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Param('resetPasswordToken') resetPasswordToken: string,
  ) {
    return this.usersService.getResetPassword(id, resetPasswordToken);
  }

  @Post('reset-password')
  public resetPassword(@Body() body: ResetPasswordDto) {
    return this.usersService.resetPassword(body);
  }
}
