import { Subscribable } from '../common';
import { ComponentEvent, ComponentType } from '../entity';
import { Entity } from '../entity';


export interface Storage<T> extends Subscribable<ComponentEvent<T>> {

  /** Unique id. */
  readonly id: number;

  /** Component type that is stored here. */
  readonly type: ComponentType<T>;

  /**
   * Assigns an `instance` of the stored component type `T` to `entity`.
   *
   * @event OnComponentAdded
   */
  set(entity: Entity, instance: T): this;

  /**
   * Returns the stored component for `entity`. Throws an error if no component is
   * stored for it.
   */
  get(entity: Entity): T;

  /**
   * Returns `true` if a component is stored for `entity`.
   */
  has(entity: Entity): boolean;

  /**
   * Removes the stored component for `entity`. Returns `true` if a component was
   * removed and `false` otherwise.
   *
   * @event OnComponentRemoved
   */
  remove(entity: Entity): boolean;

  /**
   * Updates the existing component of `entity` with `data`.
   *
   * @event OnComponentUpdated
   */
  update(entity: Entity, data: Partial<T>): this;

  /**
   * Drops all stored components.
   *
   * @event OnComponentRemoved
   */
  drop(): void;

  /**
   * Returns the entity that owns the given `component` instance, or `undefined` if
   * that component is not owned by any entity.
   */
  owner(component: T): Entity | undefined;

  /** Returns an iterator over all stored component instances. */
  components(): IterableIterator<T>;

  /** Returns an iterator over all entities that store a component instance here. */
  entities(): IterableIterator<Entity>;

}
