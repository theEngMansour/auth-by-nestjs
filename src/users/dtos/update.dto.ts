import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDto {
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  password: string;

  @IsOptional()
  @Length(2, 150)
  @ApiPropertyOptional()
  username: string;
}
