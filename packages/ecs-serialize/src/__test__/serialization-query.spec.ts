import { EntitySerializer } from '../entity-serializer';
import { World } from '@heliks/ecs';
import { TypeSerializer } from '../type-serializer';
import { SerializationQuery } from '../serialization-query';

describe('SerializationQuery', () => {
  let serializer: EntitySerializer;
  let world: World;

  beforeEach(() => {
    serializer = new EntitySerializer(new TypeSerializer());
    world = new World();
  });

  // Test component.
  class TestCmp {}

  describe('serialize()', () => {
    it('should only serialize living entities', () => {
      const query = new SerializationQuery(world, serializer).contains(TestCmp);

      world.insert(new TestCmp());
      world.insert(new TestCmp());

      const entity = world.insert(new TestCmp());

      world.destroy(entity);

      const data = query.serialize();

      expect(data).toHaveLength(2);
    });
  });

});
