import * as bcrypt from 'bcryptjs';
import bcryptPassword from '@/users/helpers/bcrypt.helper';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from '@/users/dtos/register.dto';
import { AccessTokenType } from '@/utils/type';
import { LoginDto } from '@/users/dtos/login.dto';
import { GenerateJwtHelper } from '@/users/helpers/generate-jwt.helper';

@Injectable()
export class AuthProvider extends GenerateJwtHelper {
  constructor(
    public readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(jwtService);
  }

  /**
   * Registers a new user with the provided registration details.
   * @param registerDto - The registration data transfer object containing username, email, and password.
   * @returns A promise that resolves to an access token if registration is successful.
   * @throws BadRequestException if the user already exists.
   */
  public async register(registerDto: RegisterDto): Promise<AccessTokenType> {
    const { username, email, password } = registerDto;
    const getUser: UserEntity | null = await this.userRepository.findOne({
      where: { email },
    });

    if (getUser) throw new BadRequestException('user already exist');

    const hashedPassword: string = await bcryptPassword(password);

    let newUser: UserEntity = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    newUser = await this.userRepository.save(newUser);

    const accessToken: string = await this.generateJWT({
      id: newUser.id,
      userType: newUser.userType,
    });
    return { accessToken };
  }

  /**
   * Authenticates a user with the provided login credentials.
   * @param loginDto - The login data transfer object containing email and password.
   * @returns A promise that resolves to an access token if authentication is successful.
   * @throws BadRequestException if the email or password is invalid.
   */
  public async login(loginDto: LoginDto): Promise<AccessTokenType> {
    const { email, password } = loginDto;
    const user: UserEntity | null = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) throw new BadRequestException('invalid email or password');
    const checkPassword: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!checkPassword)
      throw new BadRequestException('invalid email or password');

    const accessToken: string = await this.generateJWT({
      id: user.id,
      userType: user.userType,
    });
    return { accessToken };
  }
}
