import { getManager } from 'typeorm';
import { User } from '../entities/User';

export class UserController {
  async getUsers(): Promise<User[]> {
    return await getManager().getRepository(User).find();
  }

  async getUser(id: number): Promise<User> {
    return await getManager().getRepository(User).findOne({ id });
  }

  async getUserFromToken(token: string): Promise<User> {
    return await getManager().getRepository(User).findOne({ refreshToken: token });
  }
}
