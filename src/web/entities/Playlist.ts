import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subscription } from './Subscription';

@Entity('playlist')
export class Playlist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
    unique: true,
  })
  name: string;

  @Column('text')
  description: string;

  @OneToMany(type => Subscription, subscription => subscription.playlist)
  subscriptions: Subscription[];

  constructor(name: string) {
    super();
    this.name = name;
  }
}

