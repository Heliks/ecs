import { Subscribable } from '../common';
import { ComponentEvent } from '../entity';
import { Entity } from '../entity';

export interface Storage<T> extends Subscribable<ComponentEvent<T>> {

  /** Unique Id that is assigned to the storage when it is registered in the world. */
  readonly id: number;

  /**
   * Creates a new instance of the stored component `T`, assigns it to `entity` and
   * then returns it. If any `data` is given it will be assigned to the component
   * after its instantiation.
   */
  add(entity: Entity, data?: Partial<T>): T;

  /** Directly assigns an `instance` of the stored component `T` to `entity`. */
  set(entity: Entity, instance: T): this;

  /**
   * Returns the stored component for `entity`. Throws an error if no component is
   * stored for it.
   */
  get(entity: Entity): T;

  /** Returns `true` if a component is stored for `entity`. */
  has(entity: Entity): boolean;

  /**
   * Removes the stored component for `entity`. Returns `true` if a component was
   * removed and `false` otherwise.
   */
  remove(entity: Entity): boolean;

  /** Updates the existing component of `entity` with `data`. */
  update(entity: Entity, data: Partial<T>): this;

  /** Drops all stored components. */
  drop(): void;

}
