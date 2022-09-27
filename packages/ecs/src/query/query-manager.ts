import { Filter } from './filter';
import { Query } from './query';
import { Changes } from '../entity';


/**
 * Manages entity queries.
 *
 * For every unique filter, only one query is stored at the same time.
 *
 * @see Query
 */
export class QueryManager {

  /**
   * Contains saved queries. Each query in that list is guaranteed to have a unique
   * filter. Do not modify this directly.
   */
  public readonly items: Query[] = [];

  /** Returns an existing query that matches the given `filter`, if any. */
  public find(filter: Filter): Query | undefined {
    for (const query of this.items) {
      if (query.filter.equals(filter)) {
        return query;
      }
    }
  }

  /**
   * Saves the given `query`, but only if its filter is unique across all queries that
   * were saved so far.
   */
  public save(query: Query): this {
    if (! this.find(query.filter)) {
      this.items.push(query);
    }

    return this;
  }

  /**
   * Synchronizes the result of saved entity queries with the given change set. Should
   * be called once on each frame.
   */
  public sync(changes: Changes): void {
    if (changes.dirty) {
      for (const query of this.items) {
        query.sync(changes);
      }
    }
  }

}
