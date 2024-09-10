import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { DEFAULT_VALUE } from '../constants';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class PostStats {
  constructor(obj?: Partial<PostStats>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }

  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @OneToOne(() => Post, (post) => post.stats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  post: Post;

  @Expose()
  @Column({ default: DEFAULT_VALUE })
  views: number;

  @Expose()
  @Column({ default: DEFAULT_VALUE })
  likes: number;

  @Expose()
  @Column({ default: DEFAULT_VALUE })
  comments: number;
}
