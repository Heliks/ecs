import { Changes, Composition, Entity } from '../entity';
import { EventQueue } from '@heliks/event-queue';
import { Filter } from './filter';
import { QueryEvent } from './query-event';


/**
 * A query that matches entities based on their {@link Composition}.
 *
 * The entity {@link World} will re-use existing queries and synchronize them once
 * per update automatically. Consequently, stored queries can change their result.
 */
export class Query {

  /** Contains all matched entities. Will be updated once per world update. */
  public readonly entities: Entity[] = [];

  /** Queue that contains events for query changes. */
  public readonly events = new EventQueue<QueryEvent>();

  /** Total number of entities that are matched by this query. */
  public get size(): number {
    return this.entities.length;
  }

  /** Sparse array that maps entities to the index where they're in this query. */
  private readonly indices: (number | undefined)[] = [];

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
    const index = this.entities.length;

    this.entities.push(entity);
    this.indices[ entity ] = index;

    this.events.push(QueryEvent.added(entity));

    return this;
  }

  /** Returns true if the entity is contained in this group. */
  public has(entity: Entity): boolean {
    return this.indices[entity] !== undefined;
  }

  /** Removes an entity. */
  public remove(entity: Entity): this {
    const index = this.indices[ entity ];

    if (index !== undefined) {
      const last = this.entities[ this.entities.length - 1 ];

      // Swap remove here so we can use pop() = O(1) over splice() = O(n)
      if (index !== last) {
        this.entities[index] = last;
        this.indices[last] = index;
      }

      this.entities.pop();
      this.indices[entity] = undefined;

      this.events.push(QueryEvent.removed(entity))
    }

    return this;
  }

  /** Drops all entities from this group. */
  public drop(): this {
    for (const entity of this.entities) {
      this.events.push(QueryEvent.removed(entity));
    }

    this.entities.length = 0;
    this.indices.length = 0;

    return this;
  }

  /** Synchronizes the query result with the given `changes`. */
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
