// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassType<T = unknown> = new (...params: any[]) => T;
export type ComponentType<T = unknown> = ClassType<T>;

/** An entity is a unique symbol to which components can be attached to. */
export type Entity = symbol;

/** Contains information on how entities should be pooled. */
export interface EntityQuery {
    contains?: ClassType[];
    excludes?: ClassType[];
}

export interface ReadonlyComponentMapper<T = unknown> {

    /**
     * Returns the instance of the mapped component that belongs to
     * the given entity.
     *
     * @param entity Entity that owns the component.
     * @returns Instance of the component that belongs to the given entity
     */
    get(entity: Entity): T;

    /**
     * Returns true if the given entity owns the mapped component.
     *
     * @param entity An Entity.
     * @returns True if entity owns component.
     */
    has(entity: Entity): boolean;

}
