import { EventQueue } from '@heliks/event-queue';
import { ComponentEvent, ComponentType, Entity } from '../entity';


export interface Storage<T> {

  /** Unique id. */
  readonly id: number;

  /** Storage events are broadcast here. */
  readonly events: EventQueue<ComponentEvent<T>>;

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
