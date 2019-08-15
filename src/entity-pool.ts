import { EventEmitter } from 'event-emitter3';
import { Bitset } from './bitset';
import { Entity } from './types';
import { Filter } from './filter';

export class EntityPool extends EventEmitter {

    /** Contains references of entity symbols that satisfy this pools requirements */
    public readonly entities: Entity[] = [];

    /** Total amount of entities */
    public get size(): number {
        return this.entities.length;
    }

    /**
     * @param filter
     */
    constructor(readonly filter: Filter) {
        super();
    }

    /**
     * Returns ``true`` if the entity satisfies the pools requirements
     *
     * @param compositionId
     */
    public check(compositionId: Bitset): boolean {
        return this.filter.check(compositionId);
    }

    /**
     * Add an entity
     *
     * @param entity Entity that will be added
     * @returns this
     */
    public add(entity: Entity): this {
        this.entities.push(entity);

        this.emit('add', entity);

        return this;
    }

    /**
     * Returns ``true`` if have an entity
     *
     * @param entity Entity that must be contained
     * @returns True if the entity exists. False otherwise.
     */
    public has(entity: Entity): boolean {
        return this.index(entity) > -1;
    }

    /**
     * Removes an entity
     *
     * @param entity Entity that should be removed
     * @returns this
     */
    public remove(entity: Entity): this {
        this.entities.splice(this.index(entity), 1);

        this.emit('remove', entity);

        return this;
    }

    /** Removes all entities from this pool */
    public clear(): this {
        this.entities.length = 0;

        this.emit('clear');

        return this;
    }

    /**
     * Returns the index of an entity. For entities that are not part of this
     * pool '-1' will be returned instead
     *
     * @param entity
     */
    public index(entity: Entity): number {
        return this.entities.indexOf(entity);
    }

}
