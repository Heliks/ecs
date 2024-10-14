import { ComponentType, EntityManager } from '../../entity';
import { Filter } from '../filter';
import { Query } from '../query';


describe('Query', () => {
  describe('when syncing with changes', () => {
    let bitA = 0;
    let bitB = 0;

    let entities: EntityManager;

    // Test components.
    class CompA {}
    class CompB {}

    beforeEach(() => {
      entities = new EntityManager();

      bitA = entities.components.register(CompA);
      bitB = entities.components.register(CompB);
    });

    function create(...contains: ComponentType[]) {
      const filter = new Filter();

      for (const type of contains) {
        filter.inclusions.set(entities.components.id(type));
      }

      return new Query(filter);
    }

    it('should remove destroyed entity from result', () => {
      const entity = entities.create();

      entities.changes.set(entity, bitA);

      const query = create(CompA).add(entity);

      entities.changes.destroy(entity);

      // Synchronize should remove the entity, even though it is still eligible based
      // on known composition.
      query.sync(entities.changes);

      expect(query.entities).toHaveLength(0);
    });

    it('should add eligible entities to query result', () => {
      const entityA = 1;
      const entityB = 2;

      entities.changes.set(entityA, bitA);

      entities.changes.set(entityB, bitA);
      entities.changes.set(entityB, bitB);

      const query = create(CompA, CompB);

      query.sync(entities.changes);

      expect(query.entities).toEqual([ entityB ])
    });

    it('should remove entities that are no longer eligible to be part of the group', () => {
      const entityA = 1;
      const entityB = 2;

      entities.changes.set(entityA, bitA);

      entities.changes.set(entityB, bitA);
      entities.changes.set(entityB, bitB);

      const query = create(CompA, CompB);

      // Add eligible and non-eligible to query result. Entity A should be removed
      // during synchronization.
      query
        .add(entityA)
        .add(entityB);

      query.sync(entities.changes);

      expect(query.entities).toEqual([
        entityB
      ]);
    });
  });
});
