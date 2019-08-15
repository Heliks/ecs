import { Entity } from '../types';
import { getEntityQueryMetadata } from '../utils';
import { BaseSystem } from './base-system';
import { EntityPool } from '../entity-pool';
import { EntityManager } from '../entity-manager';

export abstract class ProcessingSystem extends BaseSystem {

    /** The pool of entities over which this system iterates. */
    protected entityPool!: EntityPool;

    /**
     * Called once for each entity that is pooled by this system during the ``update`` phase.
     *
     * @param entity The currently processed entity.
     * @param deltaTime Delta time.
     */
    protected abstract process(entity: Entity, deltaTime: number): void;

    /** {@inheritDoc BaseSystem.boot()} */
    public boot(entityMgr: EntityManager): void {
        // Register pool with the entity query that was applied to this system type
        // via the @query decorator (or one of its variants)
        this.entityPool = entityMgr.registerPool(
            getEntityQueryMetadata(this.constructor)
        );
    }

    /** {@inheritDoc BaseSystem.run()} */
    protected run(deltaTime: number): void {
        for (const entity of this.entityPool.entities) {
            this.process(entity, deltaTime);
        }
    }

}
