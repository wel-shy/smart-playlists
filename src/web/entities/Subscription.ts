import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Playlist } from './Playlist';

@Entity('subscription')
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'number',
    name: 'userId',
  })
  @ManyToOne(type => User, user => user.subscriptions)
  user: User;

  @Column({
    type: 'number',
    name: 'playlistId',
  })
  @ManyToOne(type => Playlist, playlist => playlist.subscriptions)
  playlist: Playlist;

  constructor(user: User, playlist: Playlist) {
    super();
    this.user = user;
    this.playlist = playlist;
  }
}
