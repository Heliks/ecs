import { Hierarchy } from '../hierarchy';
import { World } from '@heliks/ecs';


describe('Hierarchy', () => {
  let hierarchy: Hierarchy;
  let world: World;

  beforeEach(() => {
    hierarchy = new Hierarchy();
    world = new World();
  });

  it('should return a flat hierarchy of all children of an entity', () => {
    const a = 0;
    const b = 1;
    const c = 3;
    const d = 4;
    const e = 5;

    hierarchy.addChild(a, b);
    hierarchy.addChild(b, c);
    hierarchy.addChild(b, d);
    hierarchy.addChild(c, e);

    const children = hierarchy.flat(a).sort();

    expect(children).toEqual([ b, c, d, e ]);
  });

  describe('when destroying a tree of entities', () => {
    it('should destroy all entities', () => {
      const a = world.insert();
      const b = world.insert();
      const c = world.insert();

      hierarchy.addChild(a, b);
      hierarchy.addChild(b, c);

      hierarchy.destroy(world, a);

      expect(world.alive(a)).toBeFalsy();
      expect(world.alive(b)).toBeFalsy();
      expect(world.alive(c)).toBeFalsy();
    });

    it('should destroy entities bottom-up', () => {
      const a = world.insert();
      const b = world.insert();
      const c = world.insert();

      hierarchy.addChild(a, b);
      hierarchy.addChild(b, c);

      world.destroy = jest.fn();

      hierarchy.destroy(world, a);

      expect(world.destroy).toHaveBeenNthCalledWith(1, c);
      expect(world.destroy).toHaveBeenNthCalledWith(2, b);
      expect(world.destroy).toHaveBeenNthCalledWith(3, a);
    });

    it('should drop all child references', () => {
      const a = world.insert();
      const b = world.insert();

      hierarchy.addChild(a, b);
      hierarchy.destroy(world, a);

      const children = hierarchy.children.get(a);

      expect(children).toBeUndefined();
    });
  });

});
