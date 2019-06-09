import { _BITSET, Bitset } from './bitset';
import ComponentMapper from './component-mapper';
import { ComponentType, Entity } from './types';

export default class ComponentManager {

    /**
     * An array that contains all entities that were recently updated. Is cleared every
     * time {@link ComponentManager.clear()} is called.
     */
    public readonly updated: Entity[] = [];

    /** Composition Ids for every entity known to the manager */
    protected compositionIds = new Map<Entity, Bitset>();

    /** Contains mappers registered to their type. */
    protected mappers = new Map<ComponentType, ComponentMapper<any>>();

    /** Contains the Id that will be used for the next mapper that is added to the manager */
    protected nextMapperId: number = 0;

    /**
     * Registers a component.
     *
     * @param type The type of component to register.
     * @returns The component mapper that was created for the component type.
     */
    register<T>(type: ComponentType<T>): ComponentMapper<T> {
        const mapper = new ComponentMapper(type, this.nextMapperId++);

        this.mappers.set(type, mapper);

        return mapper;
    }

    /**
     * Returns the mapper for the given component type. If it doesn't exist it will
     * be registered automatically.
     *
     * @param type A component type.
     * @return Mapper for the given component type.
     */
    mapper<T>(type: ComponentType<T>): ComponentMapper<T> {
        let mapper = this.mappers.get(type);

        return mapper ? mapper : this.register(type);
    }

    /**
     * Creates a compositionId from a collection of component types.
     *
     * @param types
     */
    createCompositionId(types: ComponentType[]): Bitset {
        const compositionId = new _BITSET();

        for (const type of types) {
            compositionId.set(this.mapper(type).id);
        }

        return compositionId;
    }

    /**
     * Returns the composition bitset of an entity
     *
     * @param entity The entity of which we want to know the composition
     * @returns A bitset representing the component composition of the given entity
     */
    getCompositionId(entity: Entity): Bitset {
        let bitset = this.compositionIds.get(entity);

        if (bitset) {
            return bitset;
        }

        bitset = new _BITSET();

        this.compositionIds.set(entity, bitset);

        return bitset;
    }

    /**
     * Adds an id to the composition of an entity.
     *
     * @param entity The entity of which the composition should be updated
     * @param id The Id that we want to add to the composition
     */
    protected addComposition(entity: Entity, id: number): this {
        this.getCompositionId(entity).set(id);

        if (this.updated.indexOf(entity) === -1) {
            this.updated.push(entity);
        }

        return this;
    }

    /**
     * Returns ``true`` if an entity contains all components that are contained in
     * the given compositionId.
     *
     * @param entity
     * @param compositionId
     */
    matchesEntityComposition(entity: Entity, compositionId: Bitset): boolean {
        return this.getCompositionId(entity).and(compositionId).equals(compositionId);
    }

    /**
     * Adds a component to an entity.
     *
     * @param entity An entity.
     * @param type The component type that will be added.
     * @param data (optional) Data to assign to the component.
     * @returns this
     */
    add<T>(entity: Entity, type: ComponentType<T>, data: Partial<T> = {}): this {
        return this.addComposition(entity, this.mapper(type).add(entity, data).id);
    }

    /**
     * Adds multiple components to an entity.
     *
     * @param entity An entity.
     * @param types An array of component types.
     * @returns this.
     */
    addMany(entity: Entity, types: ComponentType[]): this {
        if (! types.length) {
            return this;
        }

        const composition = this.getCompositionId(entity);

        for (const type of types) {
            // add to composition
            composition.set(this.mapper(type).add(entity).id);
        }

        // notify about component additions
        if (this.updated.indexOf(entity) === -1) {
            this.updated.push(entity);
        }

        return this;
    }

    /**
     * Adds a component instance to an entity.
     *
     * @param entity An entity.
     * @param instance A component instance.
     * @returns this
     */
    addInstance<T = unknown>(entity: Entity, instance: T): this {
        return this.add(entity, instance.constructor as ComponentType);
    }

    /**
     * Checks if an entity has a component.
     *
     * @param entity An entity.
     * @param type A component type.
     * @returns True if the entity has an instance of the given component type-
     */
    has(entity: Entity, type: ComponentType<any>): boolean {
        return this.mapper(type).has(entity);
    }

    /**
     * Returns the instance of a component that belongs to the given entity.
     *
     * @param entity An entity.
     * @param type A component type.
     * @returns The component instance that belongs to the entity.
     */
    get<T>(entity: Entity, type: ComponentType<T>): T {
        return this.mapper(type).get(entity);
    }

    /**
     * Removes a component from an entity.
     *
     * @param entity An entity.
     * @param type The type of component to remove from the entity.
     * @returns this
     */
    remove(entity: Entity, type: ComponentType<any>): this {
        const mapper = this.mapper(type);

        mapper.remove(entity);

        this.getCompositionId(entity).clear(mapper.id);

        if (this.updated.indexOf(entity) === -1) {
            this.updated.push(entity);
        }

        return this;
    }

    /**
     * Removes all components of an entity.
     *
     * @param entity The entity from which all components will be removed.
     * @returns this
     */
    removeAll(entity: Entity): this {
        this.getCompositionId(entity).clear();

        for (const mapper of this.mappers.values()) {
            if (mapper.has(entity)) {
                mapper.remove(entity);
            }
        }

        return this;
    }

    /** Clears the manager. */
    clear(): void {
        this.updated.length = 0;
    }

}
