import ComponentMapper from "./component-mapper";
import EntityPool from "./entity-pool";
import { _BITSET, Bitset, ComponentType, Entity } from "./types";

export default class ComponentManager {

    /** Contains unique composition ids mapped to entities */
    protected compositionIds = new Map<Entity, Bitset>();

    /** Collection of entities that had components added to their composition */
    readonly compositionAdditions: Entity[] = [];

    /** Collection of entities that had components removed from their composition */
    readonly compositionRemovals: Entity[] = [];

    /** Contains component mappers for all registered component types. */
    protected mappers = new Map<ComponentType<any>, ComponentMapper<any>>();

    /** ID of the next component mapper that will be created */
    protected nextMapperId: number = 0;

    /**
     * Registers a component type
     *
     * @param type
     */
    register(type: ComponentType<any>): void {
        this.mappers.set(type, new ComponentMapper(
            this.nextMapperId,
            type
        ));

        this.nextMapperId++;
    }

    /**
     * Returns the ``ComponentMapper`` of a ``ComponentType``
     *
     * @param type Type of component of which we want to retrieve the mapper
     * @returns ComponentMapper that belongs to the given ComponentType
     */
    mapper<T>(type: ComponentType<T>): ComponentMapper<T> {
        if (! this.mappers.has(type)) {
            this.register(type);
        }

        return <ComponentMapper<T>>this.mappers.get(type);
    }

    /**
     * Returns the composition id of an entity
     *
     * @param entity Entity of which we want to know the composition id
     * @returns A bitset that represents the entities composition id
     */
    compositionId(entity: Entity): Bitset {
        let bitset = this.compositionIds.get(entity);

        if (bitset) {
            return bitset;
        }

        bitset = new _BITSET();

        this.compositionIds.set(entity, bitset);

        return bitset;
    }

    /**
     * Returns ``true`` if an entity contains all components that are contained in
     * the given compositionId.
     *
     * @param entity
     * @param compositionId
     */
    matchesEntityComposition(entity: Entity, compositionId: Bitset): boolean {
        return this.compositionId(entity).and(compositionId).equals(compositionId);
    }

    /**
     * Returns ``true`` if an entity recently had components added to their composition
     *
     * @param entity
     */
    hasCompositionAdditions(entity: Entity): boolean {
        return this.compositionAdditions.indexOf(entity) > -1;
    }

    /**
     * Returns ``true`` if an entity recently had components removed from their composition
     *
     * @param entity
     */
    hasCompositionRemovals(entity: Entity): boolean {
        return this.compositionRemovals.indexOf(entity) > -1;
    }

    /**
     * Creates a compositionId from a collection of component types.
     *
     * @param types
     */
    createCompositionId(types: ComponentType<any>[]): Bitset {
        const compositionId = new _BITSET();

        for (const type of types) {
            compositionId.set(this.mapper(type).id);
        }

        return compositionId;
    }


    /**
     * Adds an id to the composition of an entity.
     *
     * @param entity The entity of which the composition should be updated
     * @param id The Id that we want to add to the composition
     */
    protected addComposition(entity: Entity, id: number): void {
        this.compositionId(entity).set(id);

        if (! this.hasCompositionAdditions(entity)) {
            this.compositionAdditions.push(entity);
        }
    }

    /**
     * Adds a component to an entity.
     *
     * @param entity The target entity to which the component will be added
     * @param type The component type that will be added to the entity
     * @param params Constructor parameters that will be used to instantiate the component type
     * @returns Instance of the component that was added to the entity
     */
    addComponent<T>(entity: Entity, type: ComponentType<T>, ...params: any[]): T {
        const mapper = this.mapper(type);
        const component = mapper.create(entity, ...params);

        this.addComposition(entity, mapper.id);

        return component;
    }

    /**
     * Directly adds the instance of a component to the appropriate mappers component pool
     *
     * @param entity The entity to which the component should be assigned to
     * @param instance Component instance
     */
    addComponentInstance<T = any>(entity: Entity, instance: T): void {
        const mapper = this.mapper(instance.constructor as ComponentType<any>);

        mapper.instances.set(entity, instance);

        this.addComposition(entity, mapper.id);
    }

    /**
     * Returns ``true`` if an entity has a component.
     *
     * @param entity
     * @param type
     */
    hasComponent(entity: Entity, type: ComponentType<any>): boolean {
        return this.mapper(type).has(entity);
    }

    /**
     * Returns the instance of a component that belongs to the given entity.
     *
     * @param entity
     * @param type
     * @returns A component
     */
    getComponent<T>(entity: Entity, type: ComponentType<T>): T {
        return this.mapper(type).get(entity);
    }

    /**
     * Removes a component from an entity
     *
     * @param entity
     * @param type
     */
    removeComponent(entity: Entity, type: ComponentType<any>): void {
        const mapper = this.mapper(type);

        mapper.remove(entity);

        this.compositionId(entity).clear(mapper.id);

        if (! this.hasCompositionRemovals(entity)) {
            this.compositionRemovals.push(entity);
        }
    }

    /**
     * Synchronizes composition transforms on a collection of entity pools.
     *
     * @param pools
     */
    synchronize(pools: EntityPool[]): void {
        for (const pool of pools) {
            // entities with composition additions
            for (const entity of this.compositionAdditions) {
                if (! pool.has(entity) && pool.check(this.compositionId(entity))) {
                    pool.add(entity);
                }
            }

            // entities with composition removals
            for (const entity of this.compositionRemovals) {
                if (pool.has(entity) && ! pool.check(this.compositionId(entity))) {
                    pool.remove(entity);
                }
            }
        }
    }

    /**
     * Clears all disposable data. If you want to synchronize this data you must do so
     * before this is called during the ``update`` phase.
     */
    clear(): void {
        this.compositionAdditions.length = 0;
        this.compositionRemovals.length = 0;
    }

}