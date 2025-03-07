import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsEmail()
  @MaxLength(250)
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'your email',
    example: 'example@gmail.com',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'your password',
    example: '*********',
  })
  password: string;

  @IsOptional()
  @Length(2, 150)
  @ApiProperty({
    type: 'string',
    description: 'your username',
    example: '@mansour_tech',
  })
  username: string;
}
