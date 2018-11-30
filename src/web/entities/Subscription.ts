import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
    unique: true,
  })
  name: string;

  @Column({
    length: 255,
  })
  userId: string;

  constructor(name: string, userId: string) {
    super();
    this.name = name;
    this.userId = userId;
  }
}
