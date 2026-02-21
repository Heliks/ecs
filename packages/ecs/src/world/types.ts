import { ComponentType, Entity } from '../entity';
import { Storage } from '../storage';

/**
 * The world where all entities exist.
 *
 * Provides functionality to insert, update or destroy {@link Entity entities}.
 */
export interface World {

  /** Returns `true` if an {@link Entity} is alive and hasn't been destroyed. */
  alive(entity: Entity): boolean;

  /** Registers a component `type`. */
  register<T>(type: ComponentType<T>): Storage<T>;

  /**
   * Inserts an {@link Entity} with a set of `components` into the world.
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
   * Destroys an {@link Entity}.
   *
   * Components owned by that entity will be detached and removed from storages
   * during the next world update.
   */
  destroy(entity: Entity): this;

  /**
   * Returns the {@link Storage} for a component `type`. If the type was previously
   * unknown it will be registered automatically.
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
