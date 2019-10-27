// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassType<T = unknown> = new (...params: any[]) => T;
export type ComponentType<T = unknown> = ClassType<T>;

/** An entity is a unique symbol to which components can be attached to. */
export type Entity = symbol;

/** Contains information on how entities should be pooled. */
export interface Query {
    contains?: ClassType[];
    excludes?: ClassType[];
}

/** */
export interface ComponentBlueprint<T = unknown> {
    component: ClassType<T>;
    data?: Partial<T>;
}

export interface Storage<T> {

    /**
     * Adds a component for the given entity.
     *
     * @param entity An entity.
     * @param data (optional) Initial data that should be set on the component.
     * @returns The newly created component.
     */
    add(entity: Entity, data?: Partial<T>): T;

    /**
     * Directly assigns an instance of the stored component to the given entity.
     *
     * @param entity An entity.
     * @param instance Component instance.
     */
    set(entity: Entity, instance: T): void;

    /** Returns true if a component is stored for the given entity. */
    get(entity: Entity): T;

    /** Returns true if a component is stored for the given entity. */
    has(entity: Entity): boolean;

    /**
     * Removes the component of the given entity from the storage. Returns true if a
     * component was removed.
     */
    remove(entity: Entity): boolean;

    /** Drops the whole storage. */
    drop(): void;

}

/** A builder to create entities with. */
export interface Builder {

    /** Adds a component to the entity.  */
    add<T>(component: ClassType<T>, data?: Partial<T>): this;

    /** Builds the entity. */
    build(): Entity;

}

export interface World {

    /** Registers a component. */
    register<T>(component: ClassType<T>): Storage<T>;

    /** Returns the storage of the given component. */
    storage<T>(component: ClassType<T>): Storage<T>;

    /**
     * Returns an entity builder that can be used to build reoccurring entity
     * compositions (= "Archetype").
     */
    archetype(): Builder;

    /**
     * Creates an entity.
     *
     * @param components (optional) An array of components that are added to
     *  the entity automatically.
     * @returns The created entity.
     */
    create(components?: ClassType[]): Entity;

    /**
     * Inserts an entity into the world.
     *
     * @param entity The entity that should be inserted.
     * @param dirty (optional) If true the entity will also be marked as "dirty".
     */
    insert(entity: Entity, dirty?: boolean): void;

}
