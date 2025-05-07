import { EntitySerializer } from '../entity-serializer';
import { TypeSerializer } from '../type-serializer';
import { ComponentList, EntityBuilder, World } from '@heliks/ecs';
import { TypeStore } from '../type-store';


describe('EntitySerializer', () => {
  let serializer: EntitySerializer;
  let store: TypeStore;
  let world: World;

  beforeEach(() => {
    serializer = new EntitySerializer(new TypeSerializer(new TypeStore()));
    world = new World();
    store = serializer.types.store;
  });

  describe('when creating the entity builder', () => {
    it('should return an entity builder', () => {
      const builder = serializer.create(world, {});

      expect(builder).toBeInstanceOf(EntityBuilder);
    });

    it('should use a preset as basis', () => {
      const builder = world.create();

      // Our preset simply returns our mock builder.
      const preset = {
        create: () => builder
      };

      world.presets.set('foo', preset);

      const result = serializer.create(world, {
        preset: 'foo'
      });

      // Check if created entity has marker component.
      expect(result).toBe(builder);
    });
  });

  describe('when serializing entity components', () => {
    it('should serialize components', () => {
      class Foo {
        public foo = true;
      }

      class Bar {
        public bar = true;
      }

      store.set(Foo, 'foo');
      store.set(Bar, 'bar');

      const entity = world
        .create()
        .use(new Foo())
        .use(new Bar())
        .build();

      const types = new Set([
        Foo,
        Bar
      ]);

      const data = serializer.serializeEntityComponents(world, entity, types);

      expect(data).toEqual([
        {
          $id: 'foo',
          $data: {
            foo: true
          }
        },
        {
          $id: 'bar',
          $data: {
            bar: true
          }
        }
      ]);
    });

    it('should only serialize components included in the given component list', () => {
      class Foo {
        public foo = true;
      }

      class Bar {
        public bar = true;
      }

      store.set(Foo, 'foo');
      store.set(Bar, 'bar');

      const entity = world
        .create()
        .use(new Foo())
        .use(new Bar())
        .build();

      const types = new Set([
        Bar
      ]);

      const data = serializer.serializeEntityComponents(world, entity, types);

      expect(data).toEqual([
        {
          $id: 'bar',
          $data: {
            bar: true
          }
        }
      ]);
    });

    it('should skip components without type IDs', () => {
      // This component will receive no type ID and should therefore not be serialized.
      class Foo {
        public foo = true;
      }

      class Bar {
        public bar = true;
      }

      store.set(Bar, 'bar');

      const entity = world
        .create()
        .use(new Foo())
        .use(new Bar())
        .build();

      const types = new Set([
        Foo,
        Bar
      ]);

      const data = serializer.serializeEntityComponents(world, entity, types);

      expect(data).toEqual([
        {
          $id: 'bar',
          $data: {
            bar: true
          }
        }
      ]);
    });
  });

  describe('when deserializing entity data', () => {
    it('should deserialize components', () => {
      class Foo {
        public test = false;
      }

      store.set(Foo, 'foo');

      world.register(Foo);

      const entity = serializer.deserialize(world, {
        components: [
          {
            $id: 'foo',
            $data: {
              test: true
            }
          }
        ]
      });

      const component = world.storage(Foo).get(entity);

      expect(component.test).toBeTruthy();
    });
  });

  describe('list()', () => {
    it('should skip components that can not be serialized', () => {
      class Foo {}
      class Bar {}

      store.set(Bar, 'bar');

      const list = new ComponentList();

      list.add(new Foo());
      list.add(new Bar());

      const data = serializer.list(world, list);

      expect(data).toMatchObject({
        components: [
          {
            $id: 'bar',
            $data: {}
          }
        ]
      });
    });
  });
});
