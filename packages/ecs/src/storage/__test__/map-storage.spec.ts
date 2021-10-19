import { World } from '../../world';
import { MapStorage } from '../map-storage';
import { ComponentEventType, Entity } from '../../entity';
import { Storage } from '../storage';


describe('MapStorage', () => {
  class TestComponent {
    public test = '';
  }

  let entity: Entity;
  let storage: Storage<TestComponent>;
  let world: World;

  beforeEach(() => {
    world = new World();
    entity = Math.random();
    storage = world.storage(TestComponent);
  });

  // Add component
  describe('add()', () => {
    it('should add a component type to an entity', () => {
      storage.add(entity);

      // Component should now be stored for entity.
      expect(storage.get(entity)).toBeInstanceOf(TestComponent);
    });

    it('should update entity compositions', () => {
      const composition = world.changes.composition(entity);

      storage.add(entity);

      expect(composition.has(storage.id)).toBeTruthy();
    });

    it('should emit event ComponentEventType.Added', () => {
      const subscriber = storage.subscribe();
      const component = storage.add(entity);

      expect(storage.events(subscriber).next().value).toEqual({
        component,
        entity,
        type: ComponentEventType.Added
      });
    });
  });

  // Set component
  describe('set()', () => {
    it('should update entity compositions', () => {
      storage.set(entity, new TestComponent());

      expect(
        world.changes.composition(entity).has(storage.id)
      ).toBeTruthy();
    });

    it('should emit event ComponentEventType.Added', () => {
      const subscriber = storage.subscribe();
      const component = storage.add(entity);

      expect(storage.events(subscriber).next().value).toEqual({
        component,
        entity,
        type: ComponentEventType.Added
      });
    });
  });

  // Remove component
  describe('remove()', () => {
    it('should update entity compositions', () => {
      const composition = world.changes.composition(entity);

      storage.add(entity);
      storage.remove(entity);

      expect(composition.has(storage.id)).toBeFalsy();
    });

    it('should emit event ComponentEventType.Removed', () => {
      const component = storage.add(entity);

      // Subscribe after component was added because we are only interested
      // in the second one when the component is removed.
      const subscriber = storage.subscribe();

      storage.remove(entity);

      expect(storage.events(subscriber).next().value).toEqual({
        component,
        entity,
        type: ComponentEventType.Removed
      });
    });
  });

  describe('update()', () => {
    it('should update existing component data', () => {
      storage.add(entity);
      storage.update(entity, {
        test: 'foobar'
      });

      expect(storage.get(entity).test).toBe('foobar');
    });

    it('should emit event ComponentEventType.Updated', () => {
      const component = storage.add(entity);
      const subscriber = storage.subscribe();

      storage.update(entity, {
        test: 'foobar'
      });

      expect(storage.events(subscriber).next().value).toEqual({
        component,
        entity,
        type: ComponentEventType.Updated
      });
    });
  });

  it('should return the owner of a component instance', () => {
    const component = new TestComponent();

    storage.set(entity, component);

    const owner = storage.owner(component);

    expect(owner).toBe(entity);
  });
});
