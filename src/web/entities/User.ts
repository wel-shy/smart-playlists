import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subscription } from './Subscription';

// Maps to a table.
@Entity('user')
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    length: 255,
  })
  displayName: string;

  @Column({
    length: 255,
  })
  refreshToken: string;

  @OneToMany(type => Subscription, sub => sub.user)
  subscriptions: Subscription[];

  constructor(email: string, displayName: string, refreshToken: string) {
    super();
    this.email = email;
    this.displayName = displayName;
    this.refreshToken = refreshToken;
  }
}
