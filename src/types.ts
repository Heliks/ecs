export type ClassType<T = object> = new (...params: unknown[]) => T;
export type ComponentType<T = object> = ClassType<T>;

/** An entity is a unique symbol to which components can be attached to. */
export type Entity = symbol;

/** Contains information on how entities should be pooled. */
export interface EntityQuery {
    contains?: ComponentType[];
    excludes?: ComponentType[];
}

/** Manages the instances of a component type. */
export interface ComponentMapper<T> {

    /**
     * Creates a new instance of the mapped component type and assigns it to an entity.
     *
     * @param entity An Entity
     * @param data (optional) Data that should be set on the newly created instance.
     * @returns Instance of the component that we just created
     */
    create(entity: Entity, data: Partial<T>): T;

    /**
     * Calls {@link create()} internally, but returns the class context instead
     * of the created component.
     *
     * @param entity An entity
     * @param data (optional) Data that should be set on the newly created instance.
     * @returns this
     */
    add(entity: Entity, data: Partial<T>): this;

    /**
     * Returns the instance of the mapped component for an entity.
     *
     * @param entity Entity to which the component belongs
     * @returns Instance of the component that belongs to the given entity
     */
    get(entity: Entity): T;

    /**
     * Removes the component instance of an entity.
     *
     * @param entity An Entity
     * @returns this
     */
    remove(entity: Entity): this;

    /**
     * Returns ``true`` if a component instance exists for an entity.
     *
     * @param entity An Entity
     * @returns Boolean indicating if the entity has a component or not
     */
    has(entity: Entity): boolean;

}

/**
 * An object that contains component mapper injection information. This is
 * consumed when a system is added to the world.
 */
export interface ComponentMapperInjections<T = object> {
    key: keyof ComponentType<T>;
    type: ComponentType<T>;
}
