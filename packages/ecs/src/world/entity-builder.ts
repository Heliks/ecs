import { Entity } from '../entity';
import { World } from './types';


/** Utility to compose entities. */
export class EntityBuilder {

  /**
   * @param entity Entity that is being composed.
   * @param world World in which the entity exists.
   */
  constructor(protected readonly world: World, protected readonly entity: Entity) {}

  /** Adds the given `component` instance to the entity. */
  public use<T>(component: T): this {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.world.storage((component as any).constructor).set(this.entity, component);

    return this;
  }

  /** Returns the entity. */
  public build(): Entity {
    return this.entity;
  }

}
