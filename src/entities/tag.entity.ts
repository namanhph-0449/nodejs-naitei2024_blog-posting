import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Post } from './post.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Tag {
  constructor(obj?: Partial<Tag>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
