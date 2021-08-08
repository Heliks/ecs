import { ClassType } from '../common';
import { Entity } from './entity';

/**
 * Type alias for ClassType<T> to indicate that the constructor we are expecting
 * is that of a component.
 */
export type ComponentType<T = unknown> = ClassType<T>;

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
