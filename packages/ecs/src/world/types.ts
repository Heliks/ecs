import { ComponentType, Entity } from '../entity';
import { ClassType } from '../common';
import { Storage } from '../storage';


/** */
export interface EntityQuery {
  contains?: ClassType[];
  excludes?: ClassType[];
}

export interface World {

  /**
   * Returns `true` if `entity` is not destroyed.
   */
  alive(entity: Entity): boolean;

  /**
   * Creates a new entity. If any `components` are given they will be automatically
   * attached to it.
   */
  create(...components: object[]): Entity;

  /**
   * Destroys an `entity`. Components that belong to this entity will be removed lazily
   * during the worlds [[update()]].
   */
  destroy(entity: Entity): this;

  /**
   * Registers a storage for the component `T`.
   */
  register<T>(component: ClassType<T>): Storage<T>;

  /**
   * Registers the component type `C`, by using the storage of component type `as`.
   *
   * @typeparam A Component type that should be registered.
   * @typeparam C Component type under which type `A` should be stored.
   */
  registerAs<A, C extends A>(component: ClassType<C>, as: ComponentType<A>): Storage<A>;

  /**
   * Returns the storage for component `T`. If no storage for this component
   * exists it will be registered automatically.
   */
  storage<T>(component: ClassType<T>): Storage<T>;

}
