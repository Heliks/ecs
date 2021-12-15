import { World } from './types';
import { Entity } from '../entity';


/**
 * Entity builder.
 *
 * Unlike the normal builder this one inserts the entity only after the `build()`
 * method has been called.
 *
 * @see Builder
 */
export class LazyBuilder {

  /** @internal */
  private readonly components: object[] = [];

  /**
   * @param world Instance of the world in which the entity should be inserted.
   */
  constructor(private readonly world: World) {}

  /** @inheritDoc */
  public use(component: object): this {
    this.components.push(component);

    return this;
  }

  /** Builds the entity. */
  public build(): Entity {
    return this.world.create(...this.components);
  }

}
