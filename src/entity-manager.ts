import { BitSet } from './bit-set';
import { EntityPool } from './entity-pool';
import { Filter } from './filter';
import { Entity } from './types';

export class EntityManager {

    /** Contains all entities that are currently alive. */
    public readonly alive: Entity[] = [];

    /** Entities that had their composition updated and require synchronization. {@link sync()} */
    public readonly dirty: Entity[] = [];

    /** Composition bitsets mapped to the entity to which they belong. */
    protected readonly compositions = new Map<Entity, BitSet>();

    /** Contains all registered entity pools. */
    protected readonly pools: EntityPool[] = [];

    /** Returns the composition of an entity. */
    public composition(entity: Entity): BitSet {
        let composition = this.compositions.get(entity);

        if (composition) {
            return composition;
        }

        composition = new BitSet();

        this.compositions.set(entity, composition);

        return composition;
    }

    /**
     * Inserts an entity.
     *
     * @param entity The entity that should be inserted.
     */
    public insert(entity: Entity): void {
        this.alive.push(entity);
    }

    /** Returns true if the given entity is alive. */
    public isAlive(entity: Entity): boolean {
        return this.alive.indexOf(entity) > -1;
    }

    /** Flags the given entity as dirty. */
    public setDirty(entity: Entity): void {
        if (this.dirty.indexOf(entity) === -1 && this.isAlive(entity)) {
            this.dirty.push(entity);
        }
    }

    public registerPool(filter: Filter): EntityPool {
        const pool = new EntityPool(filter);

        // Populate with entities that are eligible.
        for (const entity of this.alive) {
            if (pool.test(this.composition(entity))) {
                pool.add(entity);
            }
        }

        this.pools.push(pool);

        return pool;
    }

    public findPools(filter: Filter): EntityPool[] {
        return this.pools.filter(pool => pool.filter.equals(filter));
    }

    /**
     * Synchronizes `dirty` ({@link dirty}) entities and updates entity pools. Should
     * be called once each frame.
     */
    public sync(): void {
        const dirty = this.dirty;

        if (! dirty.length) {
            return;
        }

        for (const pool of this.pools) {
            for (const entity of dirty) {
                // If the entity is contained in the pool and no longer eligible it will be
                // removed. If the entity is not contained but eligible it will be added to
                // the pool.
                if (pool.has(entity)) {
                    if (! pool.test(this.composition(entity))) {
                        pool.remove(entity);
                    }
                }
                else if (pool.test(this.composition(entity))) {
                    pool.add(entity);
                }
            }
        }

        this.dirty.length = 0;
    }

}
