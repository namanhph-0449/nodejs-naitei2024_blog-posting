import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Tag {
  constructor(obj?: Partial<Tag>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
