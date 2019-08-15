import { ComponentType, Entity, EntityQuery } from './types';
import { ComponentManager } from './component-manager';
import { EntityPool } from './entity-pool';
import { Filter } from './filter';

export class EntityManager {

    /** {@link ComponentManager} */
    public readonly componentManager = new ComponentManager();

    /** Contains all entities created by the entity manager */
    protected readonly entities: Entity[] = [];

    /** Contains all registered entity pools */
    protected readonly pools: EntityPool[] = [];

    /** Total amount of entities */
    public get size(): number {
        return this.entities.length;
    }

    /**
     * Creates an entity.
     *
     * @param components (optional) The entities initial component types.
     * @returns A new entity.
     */
    public create(components: ComponentType[] = []): Entity {
        const entity = Symbol();

        this.entities.push(entity);

        if (components.length) {
            this.componentManager.addMany(entity, components);
        }

        return entity;
    }

    /**
     * Unsafely destroys an enemy
     *
     * @param entity Entity to destroy
     */
    public destroyUnsafe(entity: Entity): void {
        // Remove all components
        this.componentManager.removeAll(entity);

        this.entities.splice(this.getIndex(entity), 1);
    }

    /**
     * Destroys an entity and cleans up the junk that is produced in that process.
     *
     * @param entity The entity to destroy
     * @returns this
     */
    public destroy(entity: Entity): this {
        if (! this.exists(entity)) {
            return this;
        }

        // Get pools that this entity is a member of
        const pools = this.pools.filter(pool => pool.has(entity));

        for (const pool of pools) {
            pool.remove(entity);
        }

        this.destroyUnsafe(entity);

        return this;
    }

    /** Destroys all existing entities */
    public clear(): void {
        // Empty entity pools
        for (const pool of this.pools) {
            pool.clear();
        }

        for (const entity of this.entities) {
            // We can use destroyUnsafe here because we already cleaned sub systems of
            // all entity traces with their respective clear() implementations
            this.destroyUnsafe(entity);
        }
    }

    /**
     * Returns the index of an entity
     *
     * @param entity An entity
     * @returns The entities index
     */
    public getIndex(entity: Entity): number {
        return this.entities.indexOf(entity);
    }

    /**
     * Returns true if an entity exists.
     *
     * @param entity An entity
     * @returns Boolean indicating if an entity exists or not
     */
    public exists(entity: Entity): boolean {
        return this.getIndex(entity) > -1;
    }

    /**
     * Creates a component filter based on an EntityQuery
     *
     * @param query
     */
    public createFilter(query: EntityQuery = {}): Filter {
        return new Filter(
            this.componentManager.createCompositionId(query.contains || []),
            this.componentManager.createCompositionId(query.excludes || []),
        );
    }

    /**
     * Registers an EntityPool that filters entities based on an EntityQuery
     *
     * @param query
     */
    public registerPool(query: EntityQuery): EntityPool {
        const filter = this.createFilter(query);

        // If a pool with the same filter already exist we use that one
        let pool = this.pools.find(pool => pool.filter.equals(filter));

        if (pool) {
            return pool;
        }

        pool = new EntityPool(filter);

        // Populate pool with eligible entities
        for (const entity of this.entities) {
            const compositionId = this.componentManager.getCompositionId(entity);

            if (pool.check(compositionId)) {
                pool.add(entity);
            }
        }

        this.pools.push(pool);

        return pool;
    }

    /**
     * Synchronizes entity pools with composition updates. Should be called once on
     * each frame.
     */
    public synchronize(): void {
        const entities = this.componentManager.updated;

        if (! entities.length) {
            return;
        }

        for (const pool of this.pools) {
            for (const entity of entities) {
                if (! pool.has(entity)) {
                    if (pool.check(this.componentManager.getCompositionId(entity))) {
                        pool.add(entity);
                    }
                }
                else if (! pool.check(this.componentManager.getCompositionId(entity))) {
                    pool.remove(entity);
                }
            }
        }

        this.componentManager.clear();
    }

}
