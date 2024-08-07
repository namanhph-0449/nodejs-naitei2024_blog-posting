import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Subscribe {
  constructor(obj?: Partial<Subscribe>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }

  @Column()
  @PrimaryColumn()
  subscriberId: number;

  @Column()
  @PrimaryColumn()
  subscribedId: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  expireAt: Date;
}
