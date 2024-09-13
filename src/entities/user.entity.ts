import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { UserRole } from '../constants/user-roles';
import { UserStatus } from '../constants/user-status';
import { Action } from './action.entity';
import { Comment } from './comment.entity';
import { Post } from './post.entity';
import { Expose } from 'class-transformer';

@Entity()
export class User {
  constructor(obj?: Partial<User>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }

  @PrimaryGeneratedColumn()
  userId: number;

  @Expose()
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  salt: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ nullable: true })
  deactiveReason: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Action, (action) => action.user)
  actions: Action[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({
    name: 'follow',
    joinColumn: { name: 'followerId', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'followedId', referencedColumnName: 'userId' }
  })
  followers: User[]; // who follow current User

  @ManyToMany(() => User, (user) => user.followers)
  following: User[]; // who current User follow

  @ManyToMany(() => User, (user) => user.subscribing)
  @JoinTable({
    name: 'subscribe',
    joinColumn: { name: 'subscriberId', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'subscribedId', referencedColumnName: 'userId' }
  })
  subscribers: User[];

  @ManyToMany(() => User, (user) => user.subscribers)
  subscribing: User[];
}
