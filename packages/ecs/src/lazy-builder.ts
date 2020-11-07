import { World } from './types';
import { Entity } from './entity';

/**
 * A builder that unlike the normal `Builder` will only insert the entity into
 * the world after `build()` is called.
 */
export class LazyBuilder implements LazyBuilder {

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
    return this.world.create(this.components);
  }

}
