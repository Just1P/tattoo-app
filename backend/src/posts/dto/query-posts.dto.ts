import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QueryPostsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['tattoo', 'flash', 'inspiration', 'other'])
  category?: 'tattoo' | 'flash' | 'inspiration' | 'other';

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsEnum(['available', 'booked', 'completed'])
  status?: 'available' | 'booked' | 'completed';

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(['createdAt', 'likesCount', 'commentsCount'])
  sortBy?: 'createdAt' | 'likesCount' | 'commentsCount';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
