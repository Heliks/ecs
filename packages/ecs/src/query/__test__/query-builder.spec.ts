import { QueryBuilder } from '../query-builder';
import { Composition, EntityManager } from '../../entity';
import { QueryManager } from '../query-manager';


describe('QueryBuilder', () => {
  let entities: EntityManager;
  let queries: QueryManager;

  class CompA {}
  class CompB {}
  class CompC {}

  function builder(): QueryBuilder {
    return new QueryBuilder(entities, queries);
  }

  beforeEach(() => {
    queries = new QueryManager();
    entities = new EntityManager();

    entities.components.register(CompA);
    entities.components.register(CompB);
    entities.components.register(CompC);
  });

  it('should create query', () => {
    const query = builder()
      .contains(CompA)
      .contains(CompB)
      .excludes(CompC)
      .build();

    const inclusions = new Composition();
    const exclusions = new Composition();

    inclusions.set(entities.components.id(CompA));
    inclusions.set(entities.components.id(CompB));

    exclusions.set(entities.components.id(CompC));

    expect(inclusions.equals(query.filter.inclusions)).toBeTruthy();
    expect(exclusions.equals(query.filter.exclusions)).toBeTruthy();
  });

  it('should populate query with eligible entities', () => {
    const entityA = entities.create();
    const entityB = entities.create();

    entities.changes.add(entityA, entities.components.id(CompA));
    entities.changes.add(entityB, entities.components.id(CompB));

    const query = builder().contains(CompA).build();

    expect(query.entities).toEqual([
      entityA
    ]);
  });

  it('should re-use existing queries if filter is not unique', () => {
    const queryA = builder().contains(CompA).excludes(CompC).build();
    const queryB = builder().contains(CompA).excludes(CompC).build();

    expect(queryA).toBe(queryB);
  });
});
