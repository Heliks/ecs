import ComponentManager from "./component-manager";
import EntityPool from "./entity-pool";
import Filter from "./filter";
import { Entity, EntityQuery } from "./types";

export default class EntityManager {

    /** {@see ComponentManager} */
    readonly componentManager = new ComponentManager();

    /** Contains all entities created by the entity manager */
    protected entities: Entity[] = [];

    /**
     * Collection of all registered entitity pools that will be synchronized automatically
     * during the ``update`` phase
     */
    protected pools: EntityPool[] = [];

    /** Total amount of entities */
    get totalEntities(): number {
        return this.entities.length;
    }

    /**
     * Creates an entity
     *
     * @param description Description of the entity. This is purely for debugging purposes and has no
     *  functionality attached to it whatsoever
     * @returns Entity that was just created
     */
    create(description: string = 'entity'): Entity {
        const entity = Symbol(description);

        this.entities.push(entity);

        return entity;
    }

    /**
     * Destroys an entity
     *
     * @param entity The entity to destroy
     */
    destroy(entity: Entity) {
        if (! this.exists(entity)) {
            return;
        }

        // remove all components
        this.componentManager.removeAllComponents(entity);

        this.entities.splice(this.getIndex(entity), 1);
    }

    /**
     * Returns the index of an existing entity
     *
     * @param entity The entity that we want to get the index of
     */
    getIndex(entity: Entity): number {
        return this.entities.indexOf(entity);
    }

    /**
     * Returns true if an entity exists.
     *
     * @param entity
     */
    exists(entity: Entity): boolean {
        return this.getIndex(entity) > -1;
    }

    /**
     * Creates a component filter based on an EntityQuery
     *
     * @param query
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
     * @param query
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
            const compositionId = this.componentManager.getComposition(entity);

            if (pool.check(compositionId)) {
                pool.add(entity);
            }
        }

        this.pools.push(pool);

        return pool;
    }

    /** Called on every update cycle */
    update(): void {
        this.componentManager.synchronize(this.pools);
        this.componentManager.clear();
    }

}
