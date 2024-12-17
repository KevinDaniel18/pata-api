import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PetSize } from '@prisma/client';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  breed: string;

  @IsInt()
  @Min(0)
  @Max(30)
  age: number;

  @IsBoolean()
  @IsOptional()
  isVaccinated?: boolean;

  @IsBoolean()
  @IsOptional()
  isSterilized?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  size: PetSize;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsInt()
  @IsOptional()
  ownerId?: number;
}

export class UpdatePetDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  breed?: string;

  @IsInt()
  @Min(0)
  @Max(30)
  @IsOptional()
  age?: number;

  @IsBoolean()
  @IsOptional()
  isVaccinated?: boolean;

  @IsBoolean()
  @IsOptional()
  isSterilized?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  size?: PetSize;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsOptional()
  ownerId?: number;

  @IsBoolean()
  @IsOptional()
  isAdopted?: boolean;
}
