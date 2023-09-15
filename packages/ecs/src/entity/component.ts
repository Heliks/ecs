import { Entity } from './entity';


/**
 * Total amount of unique {@link ComponentType component types} that can exist in a
 * world. This value should always be a power of 32.
 */
export const COMPONENT_TYPE_LIMIT = 64;

/**
 * The unique bit assigned to a specific {@link ComponentType component type}, which
 * simultaneously acts as the types unique identifier.
 */
export type ComponentId = number;

/**
 * Type alias for ClassType<T> to indicate that the constructor we are expecting
 * is that of a component.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentType<T = unknown> = new (...params: any[]) => T;

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

