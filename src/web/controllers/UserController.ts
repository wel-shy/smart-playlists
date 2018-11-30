import { getManager } from 'typeorm';
import { User } from '../entities/User';

export class UserController {
  /**
   * Get all users
   * @returns {Promise<User[]>}
   */
  async getUsers(): Promise<User[]> {
    return await getManager().getRepository(User).find();
  }

  /**
   * Get a user by their id
   * @param {number} id
   * @returns {Promise<User>}
   */
  async getUser(id: number): Promise<User> {
    return await getManager().getRepository(User).findOne({ id });
  }

  /**
   * Get a user by their token
   * @param {string} token
   * @returns {Promise<User>}
   */
  async getUserFromToken(token: string): Promise<User> {
    return await getManager().getRepository(User).findOne({ refreshToken: token });
  }

  /**
   * Get a user by their email address.
   * @param {string} email
   * @returns {Promise<User>}
   */
  async getUserByEmail(email: string): Promise<User> {
    return await getManager().getRepository(User).findOne({ email });
  }

  /**
   * Destroy a user
   * @param {number} id
   * @returns {Promise<void>}
   */
  async destroyUser(id: number): Promise<void> {
    await getManager().getRepository(User).delete(id);
  }
}
