import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Post } from './post.entity';
import { DEFAULT_VALUE } from '../constants';

@Entity()
export class PostStats {
  constructor(obj?: Partial<PostStats>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Post, (post) => post.stats, { onDelete: 'CASCADE' })
  post: Post;

  @Column({ default: DEFAULT_VALUE })
  views: number;

  @Column({ default: DEFAULT_VALUE })
  likes: number;

  @Column({ default: DEFAULT_VALUE })
  comments: number;
}
