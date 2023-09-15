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

    it('should not create storage if type is already initialized', () => {
      const storage1 = world.register(ComponentA);
      const storage2 = world.register(ComponentA);

      expect(storage1.id).toBe(storage2.id);
    });
  });
});
