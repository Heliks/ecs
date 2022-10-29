import { World } from '../world';


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

    it('use type as an alias for a different component storage', () => {
      world.registerAs(ComponentB, ComponentA);

      const storageA = world.storage(ComponentA);
      const storageB = world.storage(ComponentB);

      expect(storageA.id).toBe(storageB.id);
    });

    it('should not create storage if type is already initialized', () => {
      const storage1 = world.register(ComponentA);
      const storage2 = world.register(ComponentA);

      expect(storage1.id).toBe(storage2.id);
    });
  });

  describe('on update', () => {
    it('should remove detached components from storages', () => {
      const entity = world.create(new ComponentA());

      world
        .detach(entity, ComponentA)
        .update();

      const exists = world
        .storage(ComponentA)
        .has(entity);

      expect(exists).toBeFalsy();
    });
  });
});
