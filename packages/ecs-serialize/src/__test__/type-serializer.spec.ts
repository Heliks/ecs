import { Ignore } from '../ignore';
import { TypeSerializer } from '../type-serializer';
import { TypeStore } from '../type-store';
import { Deserialize, Serialize } from '../types';
import { World } from '@heliks/ecs';


describe('TypeSerializer', () => {
  let serializer: TypeSerializer;
  let world: World;

  beforeEach(() => {
    world = new World();
    serializer = new TypeSerializer(new TypeStore());
  });

  describe('when serializing', () => {
    it.each([
      1000,
      'foo',
      true,
      false
    ])('should serialize primitive "%s"', value => {
      class Foo {
        prop = value;
      }

      serializer.store.set(Foo, 'foo');

      const data = serializer.serialize(world, new Foo());

      expect(data).toMatchObject({
        $id: 'foo',
        $data: {
          prop: value
        }
      });
    });

    it('should ignore functions', () => {
      class Foo {
        public foo() {}
      }

      serializer.store.set(Foo, 'foo');

      const data = serializer.serialize(world, new Foo());

      expect(data).toMatchObject({
        $id: 'foo',
        $data: {}
      });
    });

    it('should ignore undefined properties', () => {
      class Foo {
        public p1 = undefined;
        public p2 = null;
        public p3 = true;
      }

      serializer.store.set(Foo, 'foo');

      const data = serializer.serialize(world, new Foo());

      expect(data).toMatchObject({
        $id: 'foo',
        $data: {
          p3: true
        }
      });
    });

    it('should ignore symbol properties', () => {
      class Foo {
        public p1 = Symbol();
        public p2 = true;
      }

      serializer.store.set(Foo, 'foo');

      const data = serializer.serialize(world, new Foo());

      expect(data).toMatchObject({
        $id: 'foo',
        $data: {
          p2: true
        }
      });
    });

    it('should ignore a specific property', () => {
      class Foo {
        @Ignore()
        foo = 1;

        // Only this property should be serialized.
        bar = 2;
      }

      serializer.store.set(Foo, 'foo');

      const data = serializer.serialize(world, new Foo());

      expect(data.$data.foo).toBeUndefined();
    });

    it('should serialize object properties', () => {
      class Foo {

        public test = {
          x: 1,
          y: 2
        };

      }

      serializer.store.set(Foo, 'foo');

      const data = serializer.serialize(world, new Foo());

      expect(data).toMatchObject({
        $id: 'foo',
        $data: {
          test: {
            x: 1,
            y: 2
          }
        }
      });
    });

    it('should serialize class instance properties with type IDs as type data', () => {
      class Foo {
        constructor(public expected: number) {}
      }

      class Bar {
        // Test serialization on instance level.
        public foo = new Foo(1);

        // Test nested serialization.
        public deep = {
          foo: new Foo(2),
          deeper: {
            foo: new Foo(3)
          }
        }
      }

      serializer.store.set(Foo, 'foo');
      serializer.store.set(Bar, 'bar');

      const data = serializer.serialize(world, new Bar());

      expect(data).toMatchObject({
        $id: 'bar',
        $data: {
          foo: {
            $id: 'foo',
            $data: {
              expected: 1
            }
          },
          deep: {
            foo: {
              $id: 'foo',
              $data: {
                expected: 2
              }
            },
            deeper: {
              foo: {
                $id: 'foo',
                $data: {
                  expected: 3
                }
              }
            }
          }
        }
      });
    });

    it('should serialize array properties', () => {
      class Foo {
        test = [1, 'foo', { test: 10 }];
      }

      serializer.store.set(Foo, 'foo');

      const data = serializer.serialize(world, new Foo());

      expect(data).toMatchObject({
        $id: 'foo',
        $data: {
          test: [1, 'foo', { test: 10 }]
        }
      });
    });

    it('should use custom serialization implementation of type', () => {
      class Foo implements Serialize<boolean> {

        /** @inheritDoc */
        public serialize(): boolean {
          return true;
        }

      }

      serializer.store.set(Foo, 'foo');

      const result = serializer.serialize(world, new Foo());

      expect(result).toMatchObject({
        $id: 'foo',
        $data: true
      });
    });
  });

  describe('when deserializing', () => {
    it('should re-create correct class type', () => {
      class Foo {}

      serializer.store.set(Foo, 'foo');

      const component = serializer.deserialize(world, {
        $id: 'foo',
        $data: {}
      });

      expect(component).toBeInstanceOf(Foo);
    });

    it('should assign deserialized data', () => {
      class Foo {
        public foo = false;
      }

      serializer.store.set(Foo, 'foo');

      const component = serializer.deserialize<Foo>(world, {
        $id: 'foo',
        $data: {
          foo: true
        }
      });

      expect(component.foo).toBeTruthy();
    });

    it('should deserialize type data properties', () => {
      class Foo {
        test!: boolean;
      }

      class Bar {
        foo!: Foo
      }

      serializer.store.set(Foo, 'foo');
      serializer.store.set(Bar, 'bar');

      const component = serializer.deserialize<Bar>(world, {
        $id: 'bar',
        $data: {
          foo: {
            $id: 'foo',
            $data: {
              test: true
            }
          }
        }
      })

      expect(component.foo).toBeInstanceOf(Foo);
    });

    it('should deserialize type data inside of arrays', () => {
      class Foo {
        public items: Bar[] = [];
      }

      class Bar {
        public text = '';
      }

      serializer.store.set(Foo, 'foo');
      serializer.store.set(Bar, 'bar');

      const instance = serializer.deserialize<Foo>(world, {
        $id: 'foo',
        $data: {
          items: [
            {
              $id: 'bar',
              $data: {
                text: 'Hello World'
              }
            }
          ]
        }
      });

      const item = instance.items[0];

      expect(item).toBeInstanceOf(Bar);
      expect(item.text).toBe('Hello World');
    });

    it('should use custom deserialization implementation of type', () => {
      class Foo implements Deserialize<boolean> {

        // This flag ensures the serializer is not accidentally deserializing properties
        // outside the custom deserialize() implementation.
        public skipped = true;

        // Indicates if the instance of this was properly deserialized.
        public deserialized = false;

        // Custom deserialization implementation.
        public deserialize(): void {
          this.deserialized = true;
        }

      }

      serializer.store.set(Foo, 'foo');

      const result = serializer.deserialize<Foo>(world, {
        $id: 'foo',
        $data: {
          skipped: false
        }
      });

      expect(result).toMatchObject({
        skipped: true,
        deserialized: true
      });
    });
  });
});
