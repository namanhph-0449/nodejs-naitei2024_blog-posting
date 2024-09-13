import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Comment {
  constructor(obj?: Partial<Comment>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }

  @PrimaryGeneratedColumn()
  commentId: number;

  @Expose()
  @ManyToOne(() => User, (user) => user.comments, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Expose()
  @ManyToOne(() => Comment, (comment) => comment.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentCommentId' })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent, { cascade: true })
  replies: Comment[];

  @Expose()
  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
