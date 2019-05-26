export type ClassType<T> = new (...params: any[]) => T;
export type ComponentType<T> = ClassType<T>;
export type ComponentArray<T = any> = ComponentType<T>[];
export type Entity = symbol;

export interface EntityQuery {
    contains?: ComponentType<any>[];
    excludes?: ComponentType<any>[];
}

/**
 * This symbol contains a static entity query that can be used to statically
 * assign the pooling criteria for entity systems.
 */
export interface HasEntityQuery {
    ecsEntityQuery: EntityQuery;
}

/** Lifecycle event for {@see Bootable} systems */
export interface OnBoot {

    /** Called after the event was booted. */
    onBoot(): void;

}
