import { Changes, Composition, Entity } from '../entity';
import { EventQueue } from '@heliks/event-queue';
import { Filter } from './filter';
import { QueryEvent } from './query-event';


/**
 * A query that matches entities based on their component identities.
 *
 * Queries are re-usable, which means that their result only stays valid for a single
 * frame. The result is empty until they are synchronized with changed entities.
 */
export class Query {

  /**
   * Contains all entities that were matched by this query. This is essentially the query
   * result. Saving a reference to this array will not preserve its current state because
   * queries will update their result once per frame.
   */
  public readonly entities: Entity[] = [];

  /**
   * Emits events based on changes to the query result.
   *
   * @see EntityGroupEventData
   */
  public readonly events = new EventQueue<QueryEvent>();

  /**
   * Total amount of entities that match this query.
   *
   * @see entities
   */
  public get size(): number {
    return this.entities.length;
  }

  /**
   * @param filter Filter used to determine group eligibility.
   */
  constructor(public readonly filter = new Filter()) {}

  /** Returns true if the entity satisfies the groups requirements */
  public test(composition: Composition): boolean {
    return this.filter.test(composition);
  }

  /** Add an entity to the group. */
  public add(entity: Entity): this {
    this.entities.push(entity);
    this.events.push(QueryEvent.added(entity));

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
      this.events.push(QueryEvent.removed(entity))
    }

    return this;
  }

  /** Drops all entities from this group. */
  public drop(): this {
    for (const entity of this.entities) {
      this.remove(entity);
    }

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

  /**
   * Synchronizes the query result based on the given `changes`. Will be called once per
   * frame internally using the entity manager change set.
   */
  public sync(changes: Changes): void {
    for (const entity of changes.changed) {
      const composition = changes.composition(entity);

      // If the entity no longer matches the query filter, remove it from the query
      // result. If the entity is not part of the result but should be, add it.
      if (this.has(entity)) {
        if (! this.test(composition)) {
          this.remove(entity);
        }
      }
      else if (this.test(composition)) {
        this.add(entity);
      }
    }

    // Entities that were destroyed can just be removed.
    for (const entity of changes.destroyed) {
      this.remove(entity);
    }
  }

}
