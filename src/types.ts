// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassType<T = object> = new (...params: any[]) => T;
export type ComponentType<T = object> = ClassType<T>;

/** An entity is a unique symbol to which components can be attached to. */
export type Entity = symbol;

/** Contains information on how entities should be pooled. */
export interface EntityQuery {
    contains?: ComponentType[];
    excludes?: ComponentType[];
}
