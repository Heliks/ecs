import { World } from './types';
import { Entity } from '../entity';


/**
 * Utility to compose entities.
 *
 * Unlike the normal {@link EntityBuilder entity builder} this one only inserts the
 * entity it composes into the world after it has been {@link build}.
 */
export class LazyBuilder {

  /** @internal */
  private readonly components: object[] = [];

  /**
   * @param world Instance of the world in which the entity should be inserted.
   */
  constructor(protected readonly world: World) {}

  /** @inheritDoc */
  public use(component: object): this {
    this.components.push(component);

    return this;
  }

  /** Builds the entity. */
  public build(): Entity {
    return this.world.insert(...this.components);
  }

}
