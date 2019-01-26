import BaseSystem from "./base-system";
import Bootable from "./bootable";
import EntityManager from "./entity-manager";
import EntityPool from "./entity-pool";
import { EntityQuery, HasEntityListeners } from "./types";

/**
 * Typeguard to check wether the given target has entity listener functions.
 *
 * @param target
 * @returns {boolean}
 */
export function hasEntityListeners(target: any): target is HasEntityListeners {
    return target.onAddEntity && target.onRemoveEntity;
}

/**
 * A system that pools entities
 */
export default abstract class EntitySystem extends BaseSystem implements Bootable {

    /**
     * @type {EntityPool}
     */
    protected pool?: EntityPool;

    /**
     * @param {EntityQuery} query
     */
    protected constructor(protected query: EntityQuery) {
        super();
    }

    /**
     * @returns {EntityPool}
     */
    getPool(): EntityPool {
        if (! this.pool) {
            throw new Error('Not booted');
        }

        return this.pool;
    }

    /**
     * @param {EntityManager} entityManager
     */
    boot(entityManager: EntityManager): void {
        const pool = this.pool = entityManager.registerPool(this.query);

        if (hasEntityListeners(this)) {
            pool.on('add', this.onAddEntity.bind(this));
            pool.on('remove', this.onRemoveEntity.bind(this));
        }
    }

}