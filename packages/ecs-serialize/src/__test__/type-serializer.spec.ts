import { Ignore } from '../ignore';
import { TypeSerializer } from '../type-serializer';
import { Deserialize, Serialize } from '../types';
import { World } from '@heliks/ecs';
import { clearTypeIds, UUID } from '../type-registry';


describe('TypeSerializer', () => {
  let serializer: TypeSerializer;
  let world: World;

  beforeEach(() => {
    world = new World();
    serializer = new TypeSerializer();
  });

  afterEach(() => {
    clearTypeIds();
  });

  describe('when serializing', () => {
    it.each([
      1000,
      'foo',
      true,
      false
    ])('should serialize primitive "%s"', value => {
      @UUID('0000-0000-0000-1000')
      class Foo {
        prop = value;
      }

      const data = serializer.serialize(world, new Foo());

      expect(data).toMatchObject({
        $id: '0000-0000-0000-1000',
        $data: {
          prop: value
        }
      });
    });

    it('should ignore functions', () => {
      @UUID('0000-0000-0000-0001')
      class Foo {
        public foo() {}
      }

      const data = serializer.serialize(world, new Foo());

      expect(data).toMatchObject({
        $id: '0000-0000-0000-0001',
        $data: {}
      });
    });

    it('should ignore undefined properties', () => {
      @UUID('0000-0000-0000-0001')
      class Foo {
        public p1 = undefined;
        public p2 = null;
        public p3 = true;
      }

      const data = serializer.serialize(world, new Foo());

      expect(data).toMatchObject({
        $id: '0000-0000-0000-0001',
        $data: {
          p3: true
        }
      });
    });

    it('should ignore symbol properties', () => {
      @UUID('0000-0000-0000-0001')
      class Foo {
        public p1 = Symbol();
        public p2 = true;
      }

      const data = serializer.serialize(world, new Foo());

      expect(data).toMatchObject({
        $id: '0000-0000-0000-0001',
        $data: {
          p2: true
        }
      });
    });

    it('should ignore a specific property', () => {
      @UUID('0000-0000-0000-0001')
      class Foo {
        @Ignore()
        foo = 1;

        // Only this property should be serialized.
        bar = 2;
      }

      const data = serializer.serialize(world, new Foo());

      expect(data.$data.foo).toBeUndefined();
    });

    it('should serialize object properties', () => {
      @UUID('0000-0000-0000-1000')
      class Foo {

        public test = {
          x: 1,
          y: 2
        };

      }

      const data = serializer.serialize(world, new Foo());

      expect(data).toMatchObject({
        $id: '0000-0000-0000-1000',
        $data: {
          test: {
            x: 1,
            y: 2
          }
        }
      });
    });

    it('should serialize class instance properties with type IDs as type data', () => {
      @UUID('0000-0000-0000-0001')
      class Foo {
        constructor(public expected: number) {}
      }

      @UUID('0000-0000-0000-0002')
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

      const data = serializer.serialize(world, new Bar());

      expect(data).toMatchObject({
        $id: '0000-0000-0000-0002',
        $data: {
          foo: {
            $id: '0000-0000-0000-0001',
            $data: {
              expected: 1
            }
          },
          deep: {
            foo: {
              $id: '0000-0000-0000-0001',
              $data: {
                expected: 2
              }
            },
            deeper: {
              foo: {
                $id: '0000-0000-0000-0001',
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
      @UUID('0000-0000-0000-0001')
      class Foo {
        test = [1, 'foo', { test: 10 }];
      }

      const data = serializer.serialize(world, new Foo());

      expect(data).toMatchObject({
        $id: '0000-0000-0000-0001',
        $data: {
          test: [1, 'foo', { test: 10 }]
        }
      });
    });

    it('should use custom serialization implementation of type', () => {
      @UUID('0000-0000-0000-0001')
      class Foo implements Serialize<boolean> {

        /** @inheritDoc */
        public serialize(): boolean {
          return true;
        }

      }

      const result = serializer.serialize(world, new Foo());

      expect(result).toMatchObject({
        $id: '0000-0000-0000-0001',
        $data: true
      });
    });
  });

  describe('when deserializing', () => {
    it('should re-create correct class type', () => {
      @UUID('0000-0000-0000-0001')
      class Foo {}

      const component = serializer.deserialize(world, {
        $id: '0000-0000-0000-0001',
        $data: {}
      });

      expect(component).toBeInstanceOf(Foo);
    });

    it('should assign deserialized data', () => {
      @UUID('0000-0000-0000-0001')
      class Foo {
        public foo = false;
      }

      const component = serializer.deserialize<Foo>(world, {
        $id: '0000-0000-0000-0001',
        $data: {
          foo: true
        }
      });

      expect(component.foo).toBeTruthy();
    });

    it('should deserialize type data properties', () => {
      @UUID('0000-0000-0000-0001')
      class Foo {
        test!: boolean;
      }

      @UUID('0000-0000-0000-0002')
      class Bar {
        foo!: Foo
      }

      const component = serializer.deserialize<Bar>(world, {
        $id: '0000-0000-0000-0002',
        $data: {
          foo: {
            $id: '0000-0000-0000-0001',
            $data: {
              test: true
            }
          }
        }
      })

      expect(component.foo).toBeInstanceOf(Foo);
    });

    it('should deserialize type data inside of arrays', () => {
      @UUID('foo')
      class Foo {
        public items: Bar[] = [];
      }

      @UUID('bar')
      class Bar {
        public text = '';
      }

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
      const deserialize = jest.fn();

      @UUID('0000-0000-0000-0001')
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

      const result = serializer.deserialize<Foo>(world, {
        $id: '0000-0000-0000-0001',
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
