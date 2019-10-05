import { BitSet } from './bit-set';
import { Filter } from './filter';
import { Entity } from './types';

export class EntityPool {

    /** Contains references of entity symbols that satisfy this pools requirements */
    public readonly entities: Entity[] = [];

    /** Total amount of entities */
    public get size(): number {
        return this.entities.length;
    }

    /**
     * @param filter {@see Filter}
     */
    constructor(public readonly filter: Filter) {}

    /** Returns true if the entity satisfies the pools requirements */
    public test(composition: BitSet): boolean {
        return this.filter.test(composition);
    }

    /** Add an entity to the pool. */
    public add(entity: Entity): this {
        this.entities.push(entity);

        return this;
    }

    /** Returns true if an entity is contained in the pool. */
    public has(entity: Entity): boolean {
        return this.index(entity) > -1;
    }

    /** Removes an entity from the pool. */
    public remove(entity: Entity): this {
        this.entities.splice(this.index(entity), 1);

        return this;
    }

    /** Removes all entities from this pool */
    public clear(): this {
        this.entities.length = 0;

        return this;
    }

    /**
     * Returns the index of an entity. For entities that are not part of this
     * pool '-1' will be returned instead.
     */
    public index(entity: Entity): number {
        return this.entities.indexOf(entity);
    }

}
