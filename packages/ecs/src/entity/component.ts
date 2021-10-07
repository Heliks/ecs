import { ClassType } from '../common';
import { Entity } from './entity';

/**
 * Type alias for ClassType<T> to indicate that the constructor we are expecting
 * is that of a component.
 */
export type ComponentType<T = unknown> = ClassType<T>;

/** Possible component event types. */
export enum ComponentEventType {
  Added,
  Removed,
  Updated
}

/** @internal */
interface BaseEvent<C, T extends ComponentEventType> {
  component: C;
  entity: Entity;
  type: T;
}

/** Event that occurs when a component is added to an entity. */
export type OnComponentAdded<C> = BaseEvent<C, ComponentEventType.Added>;

/** Event that occurs when a component is removed from an entity. */
export type OnComponentRemoved<C> = BaseEvent<C, ComponentEventType.Removed>;

/**
 * Event that that occurs every time the component of an existing entity is updated via
 * the `update()` method of the component storage. This event does *not* occur if the
 * component instance is manipulated directly. This means that if you want to listen for
 * a specific change on a component, you have to update it via the storage directly.
 */
export type OnComponentUpdated<C> = BaseEvent<C, ComponentEventType.Updated>;

/**
 * @see OnComponentAdded
 * @see OnComponentRemoved
 * @see OnComponentUpdated
 */
export type ComponentEvent<C> =
  OnComponentAdded<C> |
  OnComponentRemoved<C> |
  OnComponentUpdated<C>;
