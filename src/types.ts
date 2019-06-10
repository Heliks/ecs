export type ClassType<T = unknown> = new (...params: unknown[]) => T;
export type ComponentType<T = unknown> = ClassType<T>;
export type Entity = symbol;

/** Contains information on how entities should be pooled. */
export interface EntityQuery {

    /** The subset of components that queries entities must have. */
    contains?: ComponentType[];

    /** The subset of components that queried entities are not allowed to have. */
    excludes?: ComponentType[];
}

/**
 * This symbol contains a static entity query that can be used to statically
 * assign the pooling criteria for entity systems.
 */
export interface HasEntityQuery {
    ecsEntityQuery: EntityQuery;
}
