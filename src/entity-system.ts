import BaseSystem from "./base-system";
import Bootable from "./bootable";
import EntityManager from "./entity-manager";
import EntityPool from "./entity-pool";
import { EntityQuery, } from "./types";
import { hasEntityQuery, hasOnBootEvent } from './utils';

/**
 * This is the most basic system of a sub-system type that is in any way responsible
 * for pooling entities.
 */
export default class EntitySystem extends BaseSystem implements Bootable {

    /** A pool of entities that all match the entity query of this component */
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

    /** {@inheritDoc Bootable.boot} */
    boot(entityManager: EntityManager): void {
        // if no instance query was set try to resolve a static one
        if (! this.query) {
            if (! hasEntityQuery(this.constructor)) {
                throw new Error('Entity systems must specify a query.');
            }

            this.query = this.constructor.ecsEntityQuery;
        }

        this.pool = entityManager.registerPool(this.query);

        if (hasOnBootEvent(this)) {
            this.onBoot();
        }
    }

    /** {@inheritDoc BaseSystem.run} */
    run(): void {
        return;
    }

}