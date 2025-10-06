import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class PostResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  images?: string[];

  @Expose()
  tags?: string[];

  @Expose()
  category: 'tattoo' | 'flash' | 'inspiration' | 'other';

  @Expose()
  isPublic: boolean;

  @Expose()
  likesCount: number;

  @Expose()
  commentsCount: number;

  @Expose()
  location?: string;

  @Expose()
  price?: number;

  @Expose()
  status: 'available' | 'booked' | 'completed';

  @Expose()
  @Type(() => UserResponseDto)
  author: UserResponseDto;

  @Expose()
  authorId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
