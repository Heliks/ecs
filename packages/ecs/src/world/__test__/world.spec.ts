import { World } from '../world';
import { CompositionBit, Entity, EntityGroup } from '../../entity';
import { BitSet, Filter } from '../../common';

class WorldMock extends World {

  /** Helper to add a test group from composition bits. */
  public createTestGroup(inc: CompositionBit, exc: CompositionBit): EntityGroup {
    const group = new EntityGroup(new Filter(
      new BitSet(inc),
      new BitSet(exc)
    ));

    this.groups.push(group);

    return group;
  }

  /**
   * Helper to create a dirty entity that has a composition `bit` automatically applied.
   * The fact that neither component nor storage for this bit exists does not matter.
   */
  public createDirty(bit: CompositionBit): Entity {
    const entity = this.create();

    // Add the composition bit to the entity directly. The fact that neither component
    // nor storage for this bit exists does not matter.
    this.changes.add(entity, bit);

    return entity;
  }

}

describe('World', () => {
  let world: WorldMock;

  // Test components.
  class ComponentA {}
  class ComponentB {}

  beforeEach(() => {
    world = new WorldMock();
  });

  describe('components', () => {
    it('should be registered', () => {
      const storage1 = world.register(ComponentA);
      const storage2 = world.register(ComponentB);

      expect(storage1.type).toBe(ComponentA);
      expect(storage2.type).toBe(ComponentB);
    });

    it('should be mapped to an alias', () => {
      world.registerAs(ComponentB, ComponentA);

      const storageA = world.storage(ComponentA);
      const storageB = world.storage(ComponentB);

      expect(storageA.id).toBe(storageB.id);
    });

    it('storages should not receive a new id if the same component type is registered twice', () => {
      const storage1 = world.register(ComponentA);
      const storage2 = world.register(ComponentA);

      expect(storage1.id).toBe(storage2.id);
    });
  });


  it('should create compositions', () => {
    const storageA = world.storage(ComponentA);
    const storageB = world.storage(ComponentB);

    const composition = world.createComposition([ComponentA, ComponentB]);

    expect(composition.has(storageA.id)).toBeTruthy();
    expect(composition.has(storageB.id)).toBeTruthy();
  });

  // Test for synchronizing entity groups.
  describe('sync()', () => {
    // Bits representing different kinds of components
    const compBitA = 1;
    const compBitB = 2;
    const compBitC = 4;
    const compBitD = 8;

    it('should add eligible entities to groups', () => {
      const group = world.createTestGroup(compBitA | compBitB, compBitC);

      const entity1 = world.createDirty(compBitA | compBitB);
      const entity2 = world.createDirty(compBitA | compBitB | compBitD);

      // Create non-eligible entities to verify that only the correct entities were
      // really added to the groups.
      const entity3 = world.createDirty(compBitA);
      const entity4 = world.createDirty(compBitA | compBitB | compBitC);

      world.sync();

      expect(group.has(entity1)).toBeTruthy();
      expect(group.has(entity2)).toBeTruthy();

      expect(group.has(entity3)).toBeFalsy();
      expect(group.has(entity4)).toBeFalsy();
    });

    it('should remove non-eligible entities from groups', () => {
      const group = world.createTestGroup(compBitA | compBitB, compBitC);

      const entity1 = world.createDirty(compBitA);
      const entity2 = world.createDirty(compBitA | compBitB | compBitC);

      group.add(entity1);
      group.add(entity2);

      world.sync();

      expect(group.has(entity1)).toBeFalsy();
      expect(group.has(entity2)).toBeFalsy();
    });
  });

  describe('update()', () => {
    it('should synchronize groups', () => {
      world.sync = jest.fn();
      world.update();

      expect(world.sync).toHaveBeenCalledTimes(1);
    });
  });
});
