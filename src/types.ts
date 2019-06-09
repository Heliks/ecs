export type ClassType<T = unknown> = new (...params: unknown[]) => T;
export type ComponentType<T = unknown> = ClassType<T>;
export type Entity = symbol;

export interface EntityQuery {
    contains?: ComponentType[];
    excludes?: ComponentType[];
}

/**
 * This symbol contains a static entity query that can be used to statically
 * assign the pooling criteria for entity systems.
 */
export interface HasEntityQuery {
    ecsEntityQuery: EntityQuery;
}
