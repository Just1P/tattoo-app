import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

enum SortByEnum {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  LIKES_COUNT = 'likesCount',
  TITLE = 'title',
}

enum SortOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

enum CategoryEnum {
  TATTOO = 'tattoo',
  FLASH = 'flash',
  INSPIRATION = 'inspiration',
  OTHER = 'other',
}

enum StatusEnum {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  COMPLETED = 'completed',
}

export class QueryPostsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(CategoryEnum, {
    message: 'category doit être: tattoo, flash, inspiration ou other',
  })
  category?: 'tattoo' | 'flash' | 'inspiration' | 'other';

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsEnum(StatusEnum, {
    message: 'status doit être: available, booked ou completed',
  })
  status?: 'available' | 'booked' | 'completed';

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(100, { message: 'limit ne peut pas dépasser 100' })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(SortByEnum, {
    message: 'sortBy doit être: createdAt, updatedAt, likesCount ou title',
  })
  sortBy?: 'createdAt' | 'updatedAt' | 'likesCount' | 'title' = 'createdAt';

  @IsOptional()
  @IsEnum(SortOrderEnum, { message: 'sortOrder doit être: ASC ou DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
