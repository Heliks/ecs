export type ClassType<T = object> = new (...params: any[]) => T;
export type ComponentType<T = object> = ClassType<T>;
export type Entity = symbol;

/** Contains information on how entities should be pooled. */
export interface EntityQuery {

    /** The subset of components that queries entities must have. */
    contains?: ComponentType[];

    /** The subset of components that queried entities are not allowed to have. */
    excludes?: ComponentType[];

}
