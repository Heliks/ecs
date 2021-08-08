import { BitSet, Subscribable } from '../common';
import { Filter } from '../common/filter';
import { Entity } from './entity';
import { EventQueue, Subscriber } from '@heliks/event-queue';

/**
 * Event that occurs in reaction to changes in an entity group.
 * @see EntityGroupEventData
 */
export enum EntityGroupEvent {
  /** Occurs when an entity is added to the group. */
  Added,
  /** Occurs when an entity is removed from the group. */
  Removed
}

/**
 * Event data that is emitted for group events.
 * @see EntityGroupEvent
 */
interface EntityGroupEventData {
  /** The entity that was added / removed. */
  entity: Entity;
  /** Event type. */
  type: EntityGroupEvent;
}

/**
 * Pools entities together.
 *
 * Each group has its own filter which determines which entities are eligible to be
 * added to the group, but it is possible to directly add non-eligible entities.
 *
 * @event EntityGroupEvent
 */
export class EntityGroup implements Subscribable<EntityGroupEventData> {

  /** Entities contained in this group. */
  public readonly entities: Entity[] = [];

  /** @internal */
  private readonly _events = new EventQueue<EntityGroupEventData>();

  /** Total amount of entities */
  public get size(): number {
    return this.entities.length;
  }

  /**
   * @param filter Filter used to determine group eligibility.
   */
  constructor(public readonly filter = new Filter()) {}

  /** @inheritDoc */
  public subscribe(): Subscriber {
    return this._events.subscribe();
  }

  /** @inheritDoc */
  public events(subscriber: Subscriber): IterableIterator<EntityGroupEventData> {
    return this._events.read(subscriber);
  }

  /** Returns true if the entity satisfies the groups requirements */
  public test(composition: BitSet): boolean {
    return this.filter.test(composition);
  }

  /** Add an entity to the group. */
  public add(entity: Entity): this {
    this.entities.push(entity);
    this._events.push({
      entity,
      type: EntityGroupEvent.Added
    });

    return this;
  }

  /** Returns true if the entity is contained in this group. */
  public has(entity: Entity): boolean {
    return this.index(entity) > -1;
  }

  /** Removes an entity. */
  public remove(entity: Entity): this {
    if (this.has(entity)) {
      this.entities.splice(this.index(entity), 1);
      this._events.push({
        entity,
        type: EntityGroupEvent.Removed
      });
    }

    return this;
  }

  /** Removes all entities from this group. */
  public clear(): this {
    this.entities.length = 0;

    return this;
  }

  /**
   * Returns the index of an entity. If the entity is not part of this
   * group '-1' will be returned instead.
   */
  public index(entity: Entity): number {
    return this.entities.indexOf(entity);
  }

}
