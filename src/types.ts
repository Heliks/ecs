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

/** A system that iterates over entities. */
export interface ProcessingSystem {

    /**
     * Called once for each entity that is pooled by this system during the ``update`` phase.
     *
     * @param entity The currently processed entity.
     * @param deltaTime Delta time.
     */
    processEntity(entity: Entity, deltaTime: number): void;

}

/** A system that iterates over a specified component type. */
export interface ComponentSystem {

    /**
     * Called for each registered instance of the component type over which this
     * system iterates.
     *
     * @param component The currently processed component instance.
     * @param deltaTime Delta time.
     */
    processComponent(component: object, deltaTime: number): void;
}
