import { EntityManager } from '../../entity';
import { QueryManager } from '../query-manager';
import { QueryBuilder } from '../query-builder';
import { Query } from '../query';


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

  describe('when syncing with changes', () => {
    let query: Query;

    beforeEach(() => {
      query = builder().build();
      query.sync = jest.fn();

      queries.save(query);
    });

    it('should sync queries if there are changed entities', () => {
      entities.changes.changed.push(entities.create());

      queries.sync(entities.changes);

      expect(query.sync).toHaveBeenCalled();
    });

    it('should sync queries if there are destroyed entities', () => {
      entities.changes.destroyed.push(entities.create());

      queries.sync(entities.changes);

      expect(query.sync).toHaveBeenCalled();
    });

    it('should not sync if there are no changes', () => {
      queries.sync(entities.changes);

      expect(query.sync).not.toHaveBeenCalled();
    });
  });
});
