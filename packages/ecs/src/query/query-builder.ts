import { Filter } from './filter';
import { ComponentType, EntityManager } from '../entity';
import { Query } from './query';
import { QueryManager } from './query-manager';


/**
 * Builder with which an entity query can be created.
 *
 * @see Query
 */
export class QueryBuilder {

  /** @internal */
  private readonly filter = new Filter();

  /**
   * @param entities Entity manager from which entities are pulled from.
   * @param queries Query manager to which the created query will be added to.
   */
  constructor(private readonly entities: EntityManager, private readonly queries: QueryManager) {}

  /**
   * Given a component `type`, the query that is created with this builder will only
   * match entities that have components of that type attached to them.
   */
  public contains(type: ComponentType): this {
    this.filter.inclusions.add(this.entities.components.id(type));

    return this;
  }

  /**
   * Given a component `type`, the query that is created with this builder will only
   * match entities that *do not* have components of that type attached to them.
   */
  public excludes(type: ComponentType): this {
    this.filter.exclusions.add(this.entities.components.id(type));

    return this;
  }

  /**
   * Builds the query. If the filter that was composed is not unique across all saved
   * queries, the existing query will be re-used. The query is populated with a result
   * on creation.
   */
  public build(): Query {
    let query = this.queries.find(this.filter);

    if (query) {
      return query;
    }

    query = new Query(this.filter);

    // Initially populate with all entities that are eligible.
    for (const entity of this.entities.entities) {
      if (query.test(this.entities.changes.composition(entity))) {
        query.add(entity);
      }
    }

    // Persist for later re-use.
    this.queries.save(query);

    return query;
  }

}
