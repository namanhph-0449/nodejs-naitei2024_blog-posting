import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn,
        UpdateDateColumn, OneToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { PostVisibility } from '../constants/post-visibility';
import { User } from './user.entity';
import { Action } from './action.entity';
import { Comment } from './comment.entity';
import { PostStats } from './post-stats.entity';
import { Tag } from './tag.entity';


@Entity()
export class Post {
  constructor(obj?: Partial<Post>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
  
  @PrimaryGeneratedColumn()
  postId: number;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: PostVisibility, default: PostVisibility.PRIVATE })
  visible: PostVisibility;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Action, (action) => action.post)
  actions: Action[];

  @OneToOne(() => PostStats, (postStats) => postStats.post)
  stats: PostStats;

  @ManyToMany(() => Tag, tags => tags.posts)
  @JoinTable()
  tags: Tag[];
}
