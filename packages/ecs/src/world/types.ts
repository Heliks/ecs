import { ComponentType, Entity } from '../entity';
import { Storage } from '../storage';

/**
 * Container for ECS related data and systems. Provides functionality to insert,
 * update or destroy {@link Entity entities} that exist within this world.
 */
export interface World {

  /** Returns `true` if an `entity` is not destroyed. */
  alive(entity: Entity): boolean;

  /**
   * Inserts an {@link Entity entity} with a set of `components` into the world and
   * returns it.
   *
   * ```ts
   *  class Foo {}
   *  class Bar {}
   *
   *  const entityA = world.insert(new Foo());
   *  const entityB = world.insert(new Foo(), new Bar());
   * ```
   */
  insert(...components: object[]): Entity;

  /**
   * Destroys an {@link Entity entity}.
   *
   * Components that are owned by that entity will be lazily removed during the
   * worlds next {@link update} tick.
   */
  destroy(entity: Entity): this;

  /** Registers a component `type`. */
  register<T>(type: ComponentType<T>): Storage<T>;

  /**
   * Returns the component {@link Storage storage} for a component `type`. The type
   * will be {@link register registered} in the process if it isn't already.
   *
   * ```ts
   *  class Foo {}
   *
   *  // Register the component type.
   *  world.register(Foo);
   *
   *  // Get storage.
   *  const storage = world.storage(Foo);
   * ```
   */
  storage<T>(type: ComponentType<T>): Storage<T>;

}
