import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subscription } from './Subscription';

@Entity('builder')
export class Builder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
    unique: true,
  })
  name: string;

  @OneToMany(type => Subscription, sub => sub.builder)
  subscriptions: Subscription[];

  constructor(name: string) {
    super();
    this.name = name;
  }
}
