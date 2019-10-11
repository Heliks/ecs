import { BitSet } from './bit-set';
import { EntityPool } from './entity-pool';
import { Filter } from './filter';
import { Entity } from './types';

export class EntityManager {

    public readonly alive: Entity[] = [];

    public readonly dirty: Entity[] = [];

    protected readonly compositions = new Map<Entity, BitSet>();

    protected readonly pools: EntityPool[] = [];

    public composition(entity: Entity): BitSet {
        let composition = this.compositions.get(entity);

        if (composition) {
            return composition;
        }

        composition = new BitSet();

        this.compositions.set(entity, composition);

        return composition;
    }

    public insert(entity: Entity): void {
        this.alive.push(entity);
    }

    public isAlive(entity: Entity): boolean {
        return this.alive.indexOf(entity) > -1;
    }

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

    public findPoolFromFilter(filter: Filter): EntityPool | undefined {
        return this.pools.find(pool => pool.filter.equals(filter));
    }

    public pool(filter: Filter): EntityPool {
        return this.findPoolFromFilter(filter) || this.registerPool(filter);
    }

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
