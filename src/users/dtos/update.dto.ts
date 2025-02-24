import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class UpdateDto {
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @IsOptional()
  password: string;

  @IsOptional()
  @Length(2, 150)
  username: string;
}
