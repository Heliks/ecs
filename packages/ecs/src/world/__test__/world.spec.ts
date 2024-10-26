import { World } from '../world';
import { entityId } from '../../entity';
import { Query } from '../../query';


describe('World', () => {
  let world: World;

  // Test components.
  class ComponentA {}
  class ComponentB {}

  beforeEach(() => {
    world = new World();
  });

  describe('when registering component', () => {
    it('should create component storage', () => {
      const storage1 = world.register(ComponentA);
      const storage2 = world.register(ComponentB);

      expect(storage1.type).toBe(ComponentA);
      expect(storage2.type).toBe(ComponentB);
    });

    it('should not create storage if type is already initialized', () => {
      const storage1 = world.register(ComponentA);
      const storage2 = world.register(ComponentA);

      expect(storage1.id).toBe(storage2.id);
    });
  });

  describe('drop()', () => {
    it('should not cause duplicate entity indexes', () => {
      // This inserts an initial entity with the index 0.
      world.insert();

      // Dropping the world twice should only free the index 0 once.
      world.drop();
      world.drop();

      const entity0 = world.insert();
      const entity1 = world.insert();

      expect(entityId(entity0)).toBe(0);
      expect(entityId(entity1)).toBe(1);
    });

    describe('synchronization of dropped & re-created entities', () => {
      let query0: Query;
      let query1: Query;

      class Foo {}
      class Bar {}

      beforeEach(() => {
        query0 = world.query().contains(Foo).build();
        query1 = world.query().contains(Bar).build();
      });

      it('should correctly synchronize re-created entities', () => {
        world.insert(new Foo());
        world.drop();

        const entity1 = world.insert(new Bar());

        world.update();

        expect(query0.has(entity1)).toBeFalsy();
        expect(query1.has(entity1)).toBeTruthy();
      });

      it('should correctly synchronize entities that were already synchronized before', () => {
        world.insert(new Foo());
        world.update();
        world.drop();

        const entity1 = world.insert(new Bar());

        // Update again to query entity1, which should be equivalent to the first
        // entity created, into query1.
        world.update();

        expect(query0.has(entity1)).toBeFalsy();
        expect(query1.has(entity1)).toBeTruthy();
      });
    });
  });
});
