import { EntitySerializer } from '../entity-serializer';
import { TypeSerializer } from '../type-serializer';
import { EntityBuilder, Preset, Presets, World } from '@heliks/ecs';
import { clearTypeIds, UUID } from '../type-registry';


describe('EntitySerializer', () => {
  let serializer: EntitySerializer;
  let world: World;

  beforeEach(() => {
    serializer = new EntitySerializer(new TypeSerializer());
    world = new World();
  });

  afterEach(() => {
    clearTypeIds();
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
      @UUID('0000-0000-0000-0001')
      class Foo {
        public foo = true;
      }

      @UUID('0000-0000-0000-0002')
      class Bar {
        public bar = true;
      }

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
          $id: '0000-0000-0000-0001',
          $data: {
            foo: true
          }
        },
        {
          $id: '0000-0000-0000-0002',
          $data: {
            bar: true
          }
        }
      ]);
    });

    it('should skipt components not included in the component list', () => {
      @UUID('0000-0000-0000-0001')
      class Foo {
        public foo = true;
      }

      @UUID('0000-0000-0000-0002')
      class Bar {
        public bar = true;
      }

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
          $id: '0000-0000-0000-0002',
          $data: {
            bar: true
          }
        }
      ]);
    });

    it('should skip components without type IDs', () => {
      // This component has no type ID and should therefore not be serialized.
      class Foo {
        public foo = true;
      }

      @UUID('0000-0000-0000-0002')
      class Bar {
        public bar = true;
      }

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
          $id: '0000-0000-0000-0002',
          $data: {
            bar: true
          }
        }
      ]);
    });
  });

  describe('when deserializing entity data', () => {
    it('should deserialize components', () => {
      @UUID('0000-0000-0000-0001')
      class Foo {
        public test = false;
      }

      world.register(Foo);

      const entity = serializer.deserialize(world, {
        components: [
          {
            $id: '0000-0000-0000-0001',
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
});