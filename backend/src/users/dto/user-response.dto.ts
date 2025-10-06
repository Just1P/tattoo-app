import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName?: string;

  @Expose()
  lastName?: string;

  @Expose()
  phone?: string;

  @Expose()
  bio?: string;

  @Expose()
  location?: string;

  @Expose()
  website?: string;

  @Expose()
  instagram?: string;

  @Expose()
  avatar?: string;

  @Expose()
  userType: 'client' | 'artist';

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
