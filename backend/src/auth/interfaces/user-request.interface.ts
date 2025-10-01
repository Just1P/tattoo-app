import { User } from '../../users/entities/user.entity';

export interface UserRequest extends Request {
  user: User;
}
