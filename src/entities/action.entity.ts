import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ActionType } from "../constants/action-types";
import { Post } from "./post.entity";
import { User } from "./user.entity";

@Entity()
export class Action {

  constructor(obj?: Partial<Action>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.actions)
  user: User;

  @ManyToOne(() => Post, (post) => post.actions)
  post: Post;

  @Column({ type: 'enum', enum: ActionType })
  type: ActionType;

  @CreateDateColumn()
  createdAt: Date;
}
