import { World } from '../../world';
import { MapStorage } from '../map-storage';
import { ComponentEventType, Entity } from '../../entity';
import { Storage } from '../storage';


describe('MapStorage', () => {
  class TestComponent {
    public test = '';
  }

  let entity: Entity;
  let component: TestComponent;
  let storage: Storage<TestComponent>;
  let world: World;

  beforeEach(() => {
    component = new TestComponent();
    world = new World();

    entity = world.create();
    storage = world.storage(TestComponent);
  });

  // Set component
  describe('set()', () => {
    it('should update entity compositions', () => {
      storage.set(entity, component);

      const composition = world.changes.composition(entity);

      expect(composition.has(storage.id)).toBeTruthy();
    });

    it('should emit event ComponentEventType.Added', () => {
      const subscriber = storage.subscribe();

      storage.set(entity, component);

      const event = storage.events(subscriber).next().value;

      expect(event).toEqual({
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

      storage.set(entity, component);
      storage.remove(entity);

      expect(composition.has(storage.id)).toBeFalsy();
    });

    it('should emit event ComponentEventType.Removed', () => {
      storage.set(entity, component);

      // Subscribe after component was added because we are only interested
      // in the second event when the component is removed.
      const subscriber = storage.subscribe();

      storage.remove(entity);

      const event = storage.events(subscriber).next().value;

      expect(event).toEqual({
        component,
        entity,
        type: ComponentEventType.Removed
      });
    });
  });

  describe('update()', () => {
    it('should update existing component data', () => {
      storage.set(entity, component).update(entity, {
        test: 'foobar'
      });

      expect(component.test).toBe('foobar');
    });

    it('should emit event ComponentEventType.Updated', () => {
      storage.set(entity, component);

      const subscriber = storage.subscribe();

      storage.update(entity, {
        test: 'foobar'
      });

      const event = storage.events(subscriber).next().value;

      expect(event).toEqual({
        component,
        entity,
        type: ComponentEventType.Updated
      });
    });
  });

  it('should return the owner of a component instance', () => {
    storage.set(entity, component);

    const owner = storage.owner(component);

    expect(owner).toBe(entity);
  });
});
