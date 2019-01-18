import ComponentManager from "./component-manager";
import EntityPool from "./entity-pool";
import Filter from "./filter";
import { Entity, EntityQuery } from "./types";

export default class EntityManager {

    /**
     * @type {ComponentManager}
     */
    readonly componentManager = new ComponentManager();

    /**
     * Contains all entities created by the entity manager
     *
     * @type {Entity[]}
     */
    protected entities: Entity[] = [];

    /**
     * @type {EntityPool[]}
     */
    protected pools: EntityPool[] = [];

    /**
     * Total amount of entities
     *
     * @type {number}
     */
    get totalEntities(): number {
        return this.entities.length;
    }

    /**
     * Creates an entity
     *
     * @param {string} description
     * @returns {Entity}
     */
    create(description: string = 'entity'): Entity {
        const entity = Symbol(description);

        this.entities.push(entity);

        return entity;
    }

    /**
     * Creates a component filter based on an EntityQuery
     *
     * @param {EntityQuery} query
     * @returns {Filter}
     */
    createFilter(query: EntityQuery): Filter {
        return new Filter(
            this.componentManager.createCompositionId(query.contains || []),
            this.componentManager.createCompositionId(query.excludes || []),
        );
    }

    /**
     * Registers an EntityPool that filters entities based on an EntityQuery
     *
     * @param {EntityQuery} query
     * @returns {EntityPool}
     */
    registerPool(query: EntityQuery): EntityPool {
        const filter = this.createFilter(query);

        // if a pool with the same filter already exist we use that one
        let pool = this.pools.find(pool => pool.filter.equals(filter));

        if (pool) {
            return pool;
        }

        pool = new EntityPool(filter);

        // populate pool with eligible entities
        for (const entity of this.entities) {
            const compositionId = this.componentManager.compositionId(entity);

            if (pool.check(compositionId)) {
                pool.add(entity);
            }
        }

        this.pools.push(pool);

        return pool;
    }

    /**
     * Called on every update cycle.
     */
    update(): void {
        this.componentManager.synchronize(this.pools);
        this.componentManager.clear();
    }

}
