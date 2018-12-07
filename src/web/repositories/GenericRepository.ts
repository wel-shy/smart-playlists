import { BaseEntity, getManager, ObjectType } from 'typeorm';

/**
 * Generic controller for resource of type T, must extend typeorm.BaseEntity.
 */
export class GenericRepository<T extends BaseEntity> {
  private type: ObjectType<T>;

  constructor(type: ObjectType<T>) {
    this.type = type;
  }

  /**
   * Get the resource by id.
   * @param {number} id
   * @returns {Promise<T: BaseEntity>}
   */
  async get(id: number): Promise<T> {
    return await getManager().getRepository(this.type).findOne(id);
  }

  /**
   * Get all instances of resource.
   * Get all entities
   * @returns {Promise<T[]: BaseEntity[]>}
   */
  async getAll(): Promise<T[]> {
    return await getManager().getRepository(this.type).find();
  }

  /**
   * Destroy the resource.
   * @param {number} id
   * @returns {Promise<void>}
   */
  async destroy(id: number): Promise<void> {
    const entity: T = await this.get(id);
    if (entity) {
      await entity.remove();
    }
  }
}
