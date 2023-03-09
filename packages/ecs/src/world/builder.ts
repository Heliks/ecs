import { Entity } from '../entity';
import { World } from './types';


/** Builder to compose entities. */
export class Builder {

  /**
   * @param entity Entity that is being composed.
   * @param world World in which the entity exists.
   */
  constructor(protected readonly entity: Entity, protected readonly world: World) {}

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
