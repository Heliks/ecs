import { ComponentType, Entity } from '../entity';
import { World } from './types';


/** An entity builder to easily compose entities. */
export class Builder {

  /**
   * @param entity The entity that is being composed.
   * @param world World in which the entity exists.
   */
  constructor(private readonly entity: Entity, private readonly world: World) {}

  /**
   * Adds an instance of `component` to the entity. If any `data` is given it
   * will be applied to the component after its instantiation.
   */
  public add<T>(component: ComponentType<T>, data?: Partial<T>): this {
    this.world.storage(component).add(this.entity, data);

    return this;
  }

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
