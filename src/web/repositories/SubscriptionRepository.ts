import { Subscription } from '../entities/Subscription';
import { GenericRepository } from './GenericRepository';
import { getManager } from 'typeorm';
import { User } from '../entities/User';

export class SubscriptionRepository extends GenericRepository<Subscription>{
  constructor() {
    super(Subscription);
  }

  async getUserSubscriptions(user: User): Promise<Subscription[]> {
    const userWithRelations: User = await getManager().getRepository(User).findOne(user.id, {
      relations: ['subscriptions'],
    });

    console.log(userWithRelations);

    if (userWithRelations) {
      return userWithRelations.subscriptions;
    }

    return [];
  }

  async getMany(ids: number[]): Promise<Subscription[]> {
    const subs: Subscription[] = await getManager().getRepository(Subscription).findByIds(ids);
    return subs;
  }
}
