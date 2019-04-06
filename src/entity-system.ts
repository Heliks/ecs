import BaseSystem from "./base-system";
import Bootable from "./bootable";
import EntityManager from "./entity-manager";
import EntityPool from "./entity-pool";
import { EntityQuery, HasEntityListeners } from "./types";
import { hasEntityQuery } from './utils';

/**
 * Typeguard to check wether the given target has entity listener functions.
 *
 * @param target
 */
export function hasEntityListeners(target: any): target is HasEntityListeners {
    return target.onAddEntity && target.onRemoveEntity;
}

/**
 * A system that pools entities
 */
export default class EntitySystem extends BaseSystem implements Bootable {

    /** A pool of entities that all match this systems component constrains */
    protected pool?: EntityPool;

    /**
     * @param query (optional) The query used to fetch entities for the pool of this system
     */
    constructor(protected query?: EntityQuery) {
        super();
    }

    /**
     * Safe getter for the entity pool.
     *
     * @returns Entity pool of this system
     */
    getPool(): EntityPool {
        if (! this.pool) {
            throw new Error('Not booted');
        }

        return this.pool;
    }

    /** {@inheritDoc Bootable} */
    boot(entityManager: EntityManager): void {
        // if no instance query was set try to resolve a static one
        if (! this.query) {
            if (! hasEntityQuery(this.constructor)) {
                throw new Error('Entity systems must specify a query.');
            }

            this.query = this.constructor.$$query;
        }

        const pool = entityManager.registerPool(this.query);

        if (hasEntityListeners(this)) {
            pool.on('add', this.onAddEntity.bind(this));
            pool.on('remove', this.onRemoveEntity.bind(this));
        }

        this.pool = pool;
    }

    /** {@inheritDoc BaseSystem.run} */
    run(): void {
        return;
    }

}