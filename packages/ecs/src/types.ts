import { Subscriber } from '@heliks/event-queue';
import { Entity } from './entity';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassType<T = unknown> = new (...params: any[]) => T;

/**
 * Type alias for ClassType<T> to indicate that the constructor we are expecting
 * is that of a component.
 */
export type ComponentType<T = unknown> = ClassType<T>;

/** */
export interface Query {
  contains?: ClassType[];
  excludes?: ClassType[];
}

/**
 * Classes that implement methods to subscribe to an event queue.
 *
 * @typparam T Event to which we are subscribing to.
 */
export interface Subscribable<T> {
  /**
   * Subscribes to the event queue and returns a `Subscriber`. The `Subscriber` can
   * then be used to read events from the queue.
   *
   * Note: Each subscriber must consume the queue or the queue is prevented from
   * shrinking which can lead to memory leaks.
   */
  subscribe(): Subscriber;

  /**
   * Returns an iterator over all new events `T` since `subscriber` last consumed the
   * event queue.
   */
  events(subscriber: Subscriber): IterableIterator<T>;
}

/** Possible component event types. */
export enum ComponentEventType {
  /** Occurs when a component is added to an entity. */
  Added,
  /**
   * Occurs when a component is removed from an entity.
   */
  Removed,
  /**
   * Occurs every time the component of an existing entity is updated via the `update()`
   * method of the component storage. This event does NOT occur when the component is
   * initially added to the storage.
   */
  Updated
}

export interface ComponentEvent<T> {
  component: T;
  entity: Entity;
  type: ComponentEventType;
}

export interface Storage<T> extends Subscribable<ComponentEvent<T>> {

  /** Unique Id that is assigned to the storage when it is registered in the world. */
  readonly id: number;

  /**
   * Creates a new instance of the stored component `T`, assigns it to `entity` and
   * then returns it. If any `data` is given it will be assigned to the component
   * after its instantiation.
   */
  add(entity: Entity, data?: Partial<T>): T;

  /**
   * Directly assigns an `instance` of the stored component `T` to `entity`.
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
   */
  remove(entity: Entity): boolean;

  /**
   * Updates the existing component of `entity` with `data`.
   */
  update(entity: Entity, data: Partial<T>): this;

  /**
   * Drops all stored components.
   */
  drop(): void;

}

export interface World {

  /**
   * Creates a new entity. If any `components` are given they will be automatically
   * attached to it.
   */
  create(components?: object[]): Entity;

  /**
   * Registers a storage for the component `T`.
   */
  register<T>(component: ClassType<T>): Storage<T>;

  /**
   * Returns the storage for component `T`. If no storage for this component
   * exists it will be registered automatically.
   */
  storage<T>(component: ClassType<T>): Storage<T>;

}

