import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsEnum(['tattoo', 'flash', 'inspiration', 'other'])
  @IsOptional()
  category?: 'tattoo' | 'flash' | 'inspiration' | 'other';

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsEnum(['available', 'booked', 'completed'])
  @IsOptional()
  status?: 'available' | 'booked' | 'completed';
}
