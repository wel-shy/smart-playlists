import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  constructor(email: string, displayName: string, refreshToken: string) {
    super();
    this.email = email;
    this.displayName = displayName;
    this.refreshToken = refreshToken;
  }
}
