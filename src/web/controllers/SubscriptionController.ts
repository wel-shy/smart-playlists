import { Subscription } from '../entities/Subscription';

export class SubscriptionController {
  async getUserSubscriptions(userId: number): Promise<Subscription[]> {
    return [];
  }
}
