import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({
    type: 'enum',
    enum: ['tattoo', 'flash', 'inspiration', 'other'],
    default: 'tattoo',
  })
  category: 'tattoo' | 'flash' | 'inspiration' | 'other';

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column({
    type: 'enum',
    enum: ['available', 'booked', 'completed'],
    default: 'available',
  })
  status: 'available' | 'booked' | 'completed';

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
