import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsEmail() email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  country: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password: string;
}
