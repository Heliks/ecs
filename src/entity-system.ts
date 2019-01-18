import BaseSystem from "./base-system";
import Bootable from "./bootable";
import EntityManager from "./entity-manager";
import EntityPool from "./entity-pool";
import { EntityQuery } from "./types";

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
        this.pool = entityManager.registerPool(this.query);
    }

}