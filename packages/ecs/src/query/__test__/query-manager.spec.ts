import { EntityManager } from '../../entity';
import { QueryManager } from '../query-manager';
import { QueryBuilder } from '../query-builder';


describe('QueryManager', () => {
  let entities: EntityManager;
  let queries: QueryManager;

  function builder(): QueryBuilder {
    return new QueryBuilder(entities, queries);
  }

  beforeEach(() => {
    queries = new QueryManager();
    entities = new EntityManager();
  });

  it('should find a query based on a filter', () => {
    class A {}

    const original = builder().contains(A).build();

    queries.items.push(original);

    // Try to find original query based on filter.
    const query = queries.find(builder().contains(A).build().filter);

    expect(query).toBe(original);
  });
});
