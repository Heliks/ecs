import { EventEmitter } from 'event-emitter3';
import Filter from "./filter";
import { Bitset, Entity } from "./types";

export default class EntityPool extends EventEmitter {

    /**
     * Contains references of entity symbols that satisfy this pools requirements
     *
     * @type {Entity[]}
     */
    readonly entities: Entity[] = [];

    /**
     * Total amount of entities
     *
     * @type {number}
     */
    get length(): number {
        return this.entities.length;
    }

    /**
     * @param {Filter} filter
     */
    constructor(readonly filter: Filter) {
        super();
    }

    /**
     * Returns ``true`` if the entity satisfies the pools requirements
     *
     * @param {BitSet} compositionId
     * @returns {boolean}
     */
    check(compositionId: Bitset): boolean {
        return this.filter.check(compositionId);
    }

    /**
     * Add an entity
     *
     * @param {Entity} entity
     */
    add(entity: Entity): void {
        this.entities.push(entity);

        this.emit('add', entity);
    }

    /**
     * Returns ``true`` if have an entity
     *
     * @param {Entity} entity
     * @returns {boolean}
     */
    has(entity: Entity): boolean {
        return this.index(entity) > -1;
    }

    /**
     * Removes an entity
     *
     * @param {Entity} entity
     */
    remove(entity: Entity): void {
        this.entities.splice(this.index(entity), 1);

        this.emit('remove', entity);
    }

    /**
     * Returns the index of an entity. For entities that are not part of this
     * pool "-1" will be returned instead
     *
     * @param {Entity} entity
     * @returns {number}
     */
    index(entity: Entity): number {
        return this.entities.indexOf(entity);
    }

}