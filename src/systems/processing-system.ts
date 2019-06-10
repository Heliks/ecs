import EntityManager from '../entity-manager';
import EntityPool from '../entity-pool';
import { Entity, EntityQuery } from '../types';
import BaseSystem from './base-system';

export default abstract class ProcessingSystem extends BaseSystem {

    /** Pooled entities narrowed by {@link ProcessingSystem.getQuery()} */
    protected _entityPool!: EntityPool;

    /**
     * Called once for each entity that is pooled by this system during the ``update`` phase.
     *
     * @param entity The currently processed entity.
     * @param deltaTime Delta time.
     */
    protected abstract process(entity: Entity, deltaTime: number): void;

    /**
     * Returns the entity query that is used to pool entities.
     *
     * @returns An entity query.
     */
    protected abstract getQuery(): EntityQuery;

    /** {@inheritDoc BaseSystem.boot()} */
    boot(entityManager: EntityManager) {
        this._entityPool = entityManager.registerPool(this.getQuery());
    }

    /** {@inheritDoc BaseSystem.run()} */
    protected run(deltaTime: number): void {
        for (const entity of this._entityPool.entities) {
            this.process(entity, deltaTime);
        }
    }

}