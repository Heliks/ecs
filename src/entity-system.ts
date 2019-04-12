import BaseSystem from "./base-system";
import Bootable from "./bootable";
import EntityManager from "./entity-manager";
import EntityPool from "./entity-pool";
import { EntityEvent, EntityQuery, OnEntityChanges } from "./types";
import { hasEntityQuery } from './utils';

/**
 * Type guard to check if the given target has lifecycle functions for entity changes
 *
 * @param target The target that should be checked
 * @returns A boolean indicating if the given target can listen to entity changes
 */
export function canListenToEntityChanges(target: any): target is OnEntityChanges {
    return target.onAddEntity && target.onRemoveEntity;
}

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

        // lifecycle: entity changes
        if (canListenToEntityChanges(this)) {
            pool.on(EntityEvent.Add, this.onAddEntity.bind(this));
            pool.on(EntityEvent.Remove, this.onRemoveEntity.bind(this));
        }

        this.pool = pool;
    }

    /** {@inheritDoc BaseSystem.run} */
    run(): void {
        return;
    }

}