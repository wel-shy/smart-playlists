import { getManager } from 'typeorm';
import { User } from '../entities/User';
import { GenericRepository } from './GenericRepository';

export class UserRepository extends GenericRepository<User>{
  constructor() {
    super(User);
  }

  /**
   * Get a user by their email address.
   * @param {string} email
   * @returns {Promise<User>}
   */
  async getUserByEmail(email: string): Promise<User> {
    return await getManager().getRepository(User).findOne({ email });
  }
}
