import { EventEmitter } from 'event-emitter3';
import { Bitset } from './bitset';
import Filter from "./filter";
import { Entity, ENTITY_EVENT_ADD, ENTITY_EVENT_CLEAR, ENTITY_EVENT_REMOVE } from "./types";

export default class EntityPool extends EventEmitter {

    /** Contains references of entity symbols that satisfy this pools requirements */
    readonly entities: Entity[] = [];

    /** Total amount of entities */
    get length(): number {
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
    check(compositionId: Bitset): boolean {
        return this.filter.check(compositionId);
    }

    /**
     * Add an entity
     *
     * @param entity
     */
    add(entity: Entity): void {
        this.entities.push(entity);

        this.emit(ENTITY_EVENT_ADD, entity);
    }

    /**
     * Returns ``true`` if have an entity
     *
     * @param entity
     */
    has(entity: Entity): boolean {
        return this.index(entity) > -1;
    }

    /**
     * Removes an entity
     *
     * @param entity
     */
    remove(entity: Entity): void {
        this.entities.splice(this.index(entity), 1);

        this.emit(ENTITY_EVENT_REMOVE, entity);
    }

    /** Removes all entities from this pool */
    clear(): void {
        this.entities.length = 0;

        this.emit(ENTITY_EVENT_CLEAR);
    }

    /**
     * Returns the index of an entity. For entities that are not part of this
     * pool "-1" will be returned instead
     *
     * @param entity
     */
    index(entity: Entity): number {
        return this.entities.indexOf(entity);
    }

}
