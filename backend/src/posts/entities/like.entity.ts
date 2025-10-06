import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from './post.entity';

@Entity('likes')
@Index(['userId', 'postId'], { unique: true })
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post, (post) => post.likes, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  @Index()
  userId: string;

  @Column()
  @Index()
  postId: string;

  @CreateDateColumn()
  createdAt: Date;
}
