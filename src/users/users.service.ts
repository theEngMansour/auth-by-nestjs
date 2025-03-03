import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Like, Repository } from 'typeorm';
import { UserEntity } from '@/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from '@/users/dtos/register.dto';
import { LoginDto } from '@/users/dtos/login.dto';
import { JWTPayLoadType } from '@/utils/type';
import { GenerateJwtHelper } from '@/users/helpers/generate-jwt.helper';
import { UpdateDto } from '@/users/dtos/update.dto';
import bcryptPassword from '@/users/helpers/bcrypt.helper';
import { AuthProvider } from '@/users/providers/auth.provider';
import { join } from 'node:path';
import { existsSync, unlinkSync } from 'node:fs';
import { ResetPasswordDto } from '@/users/dtos/reset-password.dto';

@Injectable()
export class UsersService extends GenerateJwtHelper {
  constructor(
    public readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authProvider: AuthProvider,
  ) {
    super(jwtService);
  }

  /**
   * Registers a new user with the provided registration details.
   * @param registerDto - The registration data transfer object containing username, email, and password.
   * @returns A promise that resolves to an access token if registration is successful.
   * @throws BadRequestException if the user already exists.
   */
  public async register(registerDto: RegisterDto) {
    return await this.authProvider.register(registerDto);
  }

  /**
   * Authenticates a user with the provided login credentials.
   * @param loginDto - The login data transfer object containing email and password.
   * @returns A promise that resolves to an access token if authentication is successful.
   * @throws BadRequestException if the email or password is invalid.
   */
  public async login(loginDto: LoginDto) {
    return await this.authProvider.login(loginDto);
  }

  /**
   * Retrieves the current user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the UserEntity object or null if not found.
   * @throws NotFoundException if the user is not found.
   */
  public async getCurrentUser(id: number): Promise<UserEntity | null> {
    const user: UserEntity | null = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('user not found');
    // console.log(user.getFullName());
    return user;
  }

  /**
   * Retrieves all users from the database.
   * @returns A promise that resolves to an array of All User objects.
   */
  public async getAllUsers(
    type: string,
    pageNumber: number,
    total: number,
  ): Promise<UserEntity[]> {
    const filters = {
      ...(type ? { username: Like(`%${type}%`) } : {}),
    };
    return await this.userRepository.find({
      where: filters,
      skip: total * (pageNumber - 1),
      take: total,
    });
  }

  public async update(id: number, updateDto: UpdateDto): Promise<UserEntity> {
    const { username, password } = updateDto;
    const user: UserEntity | null = await this.userRepository.findOne({
      where: { id },
    });
    if (user) {
      user.username = username ?? user?.username;
      if (password) {
        user.password = await bcryptPassword(password);
      }
      return this.userRepository.save(user);
    }
    throw new NotFoundException('user not found');
  }

  public async delete(userId: number, payload: JWTPayLoadType) {
    const user: UserEntity | null = await this.getCurrentUser(userId);
    if (user && (payload.userType == 'admin' || user?.id == payload.id)) {
      await this.userRepository.remove(user);
      return { message: 'user deleted' };
    }
    throw new ForbiddenException('you are not allowed to delete this user');
  }

  public async setProfileImage(userId: number, newProfileImage: string) {
    const user: UserEntity | null = await this.getCurrentUser(userId);
    if (user) {
      if (user.profileImage == null) {
        return (user.profileImage = newProfileImage);
      } else {
        await this.removeProfileImage(userId);
        user.profileImage = newProfileImage;
      }
      return this.userRepository.save(user);
    }
  }

  public async removeProfileImage(userId: number) {
    const user: UserEntity | null = await this.getCurrentUser(userId);

    if (user) {
      if (!user.profileImage) {
        throw new BadRequestException('There is no profile image');
      }

      const imagePath: string = join(
        process.cwd(),
        `./files/${user.profileImage}`,
      );

      if (existsSync(imagePath)) {
        unlinkSync(imagePath);
      }

      user.profileImage = null as unknown as string;
      return this.userRepository.save(user);
    }
  }

  public async verifyEmail(userId: number, verificationToken: string) {
    const user: UserEntity | null = await this.getCurrentUser(userId);
    if (user?.verificationToken == null)
      throw new NotFoundException('Not Found Exception');
    if (user.verificationToken !== verificationToken)
      throw new BadRequestException('invalid link');
    user.verificationToken = null as unknown as string;
    user.isAccountVerified = true;

    await this.userRepository.save(user);
    return {
      message: 'Your email has been verified, please log in to your account',
    };
  }

  public sendResetPassword(email: string) {
    return this.authProvider.sendResetPassword(email);
  }

  public getResetPassword(userId: number, resetPasswordToken: string) {
    return this.authProvider.getResetPasswordLink(userId, resetPasswordToken);
  }

  public resetPassword(dto: ResetPasswordDto) {
    return this.authProvider.resetPassword(dto);
  }
}
