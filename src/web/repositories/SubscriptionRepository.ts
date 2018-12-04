import { Subscription } from '../entities/Subscription';
import { GenericRepository } from './GenericRepository';
import { getManager } from 'typeorm';
import { User } from '../entities/User';

export class SubscriptionRepository extends GenericRepository<Subscription>{
  constructor() {
    super(Subscription);
  }

  async getUserSubscriptions(user: User): Promise<Subscription[]> {
    const userWithRelations: User = await getManager().getRepository(User).findOne({
      relations: ['subscriptions'],
      where: { id: user.id },
    });

    if (userWithRelations) {
      return userWithRelations.subscriptions;
    }

    return [];
  }
}
