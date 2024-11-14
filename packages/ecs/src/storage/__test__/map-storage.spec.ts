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

    entity = world.insert();
    storage = world.storage(TestComponent);
  });

  // Set component
  describe('when assigning a component to an entity', () => {
    it('the entity composition should be updated', () => {
      storage.set(entity, component);

      const composition = world.changes.composition(entity);

      expect(composition.has(storage.id)).toBeTruthy();
    });

    it('an event should be emitted', () => {
      const subscriber = storage.events.subscribe();

      storage.set(entity, component);

      const event = subscriber.next();

      expect(event).toMatchObject({
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
      const subscriber = storage.events.subscribe();

      storage.remove(entity);

      const event = subscriber.next();

      expect(event).toEqual({
        component,
        entity,
        type: ComponentEventType.Removed
      });
    });
  });

  it('should return the owner of a component instance', () => {
    storage.set(entity, component);

    const owner = storage.owner(component);

    expect(owner).toBe(entity);
  });
});
