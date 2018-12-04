import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Builder } from './Builder';

@Entity('subscription')
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.id)
  user: User;

  @ManyToOne(type => Builder, builder => builder.id)
  builder: Builder;

  constructor(user: User, builder: Builder) {
    super();
    this.user = user;
    this.builder = builder;
  }
}
