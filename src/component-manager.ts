import ComponentMapper from "./component-mapper";
import EntityPool from "./entity-pool";
import { _BITSET, Bitset, ComponentType, Entity } from "./types";

export default class ComponentManager {

    /**
     * Contains unique composition ids mapped to entities.
     *
     * @type {Map<Entity, BitSet>}
     */
    protected compositionIds = new Map<Entity, Bitset>();

    /**
     * Collection of entities that had components added to their composition
     *
     * @type {Entity[]}
     */
    readonly compositionAdditions: Entity[] = [];

    /**
     * Collection of entities that had components removed from their composition
     *
     * @type {Entity[]}
     */
    readonly compositionRemovals: Entity[] = [];

    /**
     * Contains component mappers for all registered component types.
     *
     * @type {Map<ComponentType<any>, ComponentMapper<any>>}
     */
    protected mappers = new Map<ComponentType<any>, ComponentMapper<any>>();

    /**
     * The id of the next component mapper that will be created
     *
     * @type {number}
     */
    protected nextMapperId: number = 0;

    /**
     * Registers a component type
     *
     * @param {ComponentType<any>} type
     */
    register(type: ComponentType<any>): void {
        this.mappers.set(type, new ComponentMapper(
            this.nextMapperId,
            type
        ));

        this.nextMapperId++;
    }

    /**
     * Getter for component mappers. If the given component type is not yet
     * registered it will be automatically.
     *
     * @param {ComponentType<T>} type
     * @returns {ComponentMapper<T>}
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
     * @param {Entity} entity
     * @returns {BitSet}
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
     * @param {Entity} entity
     * @param {BitSet} compositionId
     * @returns {boolean}
     */
    matchesEntityComposition(entity: Entity, compositionId: Bitset): boolean {
        return this.compositionId(entity).and(compositionId).equals(compositionId);
    }

    /**
     * Returns ``true`` if an entity recently had components added to their composition
     *
     * @param {Entity} entity
     * @returns {boolean}
     */
    hasCompositionAdditions(entity: Entity): boolean {
        return this.compositionAdditions.indexOf(entity) > -1;
    }

    /**
     * Returns ``true`` if an entity recently had components removed from their composition
     *
     * @param {Entity} entity
     * @returns {boolean}
     */
    hasCompositionRemovals(entity: Entity): boolean {
        return this.compositionRemovals.indexOf(entity) > -1;
    }

    /**
     * Creates a compositionId from a collection of component types.
     *
     * @param {ComponentType<any>[]} types
     * @returns {BitSet}
     */
    createCompositionId(types: ComponentType<any>[]): Bitset {
        const compositionId = new _BITSET();

        for (const type of types) {
            compositionId.set(this.mapper(type).id);
        }

        return compositionId;
    }

    /**
     * Adds a component to an entity.
     *
     * @param {Entity} entity   The target entity to which the component will be added
     * @param {ComponentType<T>} type   The component type that will be added to the entity
     * @param {any[]} params    Constructor parameters that will be used to instantiate the component type
     * @returns {T}
     */
    addComponent<T>(entity: Entity, type: ComponentType<T>, ...params: any[]): T {
        const mapper = this.mapper(type);
        const component = mapper.create(entity, ...params);

        this.compositionId(entity).set(mapper.id);

        if (! this.hasCompositionAdditions(entity)) {
            this.compositionAdditions.push(entity);
        }

        return component;
    }

    /**
     * Returns ``true`` if an entity has a component.
     *
     * @param {Entity} entity
     * @param {ComponentType<any>} type
     * @returns {boolean}
     */
    hasComponent(entity: Entity, type: ComponentType<any>): boolean {
        return this.mapper(type).has(entity);
    }

    /**
     * Returns the instance of a component that belongs to the given entity.
     *
     * @param {Entity} entity
     * @param {ComponentType<T>} type
     * @returns {T}
     */
    getComponent<T>(entity: Entity, type: ComponentType<T>): T {
        return this.mapper(type).get(entity);
    }

    /**
     * Removes a component from an entity
     *
     * @param {Entity} entity
     * @param {ComponentType<any>} type
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
     * Clears all disposable data. If you want to ``synchronize`` this data
     * you must do so before ``clear`` is called.
     */
    clear(): void {
        this.compositionAdditions.length = 0;
        this.compositionRemovals.length = 0;
    }

}