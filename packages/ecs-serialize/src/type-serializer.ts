import { isIgnored } from './ignore';
import { Deserialize, InstanceData, Serialize, TypeData } from './types';
import { World } from '@heliks/ecs';
import { getTypeFromId, getTypeId, hasTypeId } from './type-registry';


/** @internal */
function isSerializeable<T extends object>(target: object): target is Serialize<T> {
  return typeof (target as Serialize<T>).serialize === 'function';
}

/** @internal */
function isDeserializeable<T extends object>(target: object): target is Deserialize<T> {
  return typeof (target as Deserialize<T>).deserialize === 'function';
}

/** @internal */
function isTypeData<T>(target: unknown): target is TypeData<T> {
  return Boolean((target as TypeData<T>).$data);
}

/**
 * Serialization for class types.
 *
 * The serializer will serialize most class types automatically, but supports custom
 * serialization logic for more complex cases. It will look for implementations of
 * {@link Serialize} for serialization, and {@link Deserialize} for deserialization
 * on the type that it is trying to serialize and will use them if they are available.
 *
 * ### Preparing a class for serialization
 *
 * Class types require a type ID before they can be serialized. This is done by using
 * the {@link UUID} decorator. Each type requires its own unique ID.
 *
 * ```ts
 *  @UUID('0000-0000-0000-0000')
 *  class Foo {}
 * ```
 *
 * This also works recursively, which means that the serializer can (de-)serialize
 * nested types as well.
 *
 * ```ts
 *  @UUID('0000-0000-0000-0000')
 *  class Foo {}
 *
 *  @UUID('0000-0000-0000-0001')
 *  class Bar {
 *    foo = new Foo();
 *  }
 * ```
 *
 * The serializer will attempt to serialize all objects, arrays & primitives found
 * on a type. Functions, symbols & null (`undefined`, `null`) values will be ignored.
 *
 * ### Ignore properties
 *
 * You can ignore certain properties using the {@link Ignore} decorator.
 *
 * ```ts
 *  @UUID('0000-0000-0000-0000')
 *  class CustomType {
 *
 *    foo = true;
 *
 *    // This property will not be serialized.
 *    @Ignore()
 *    bar = true;
 *
 *  }
 * ```
 */
export class TypeSerializer {

  /** @internal */
  private serializeObjectData<T extends object>(world: World, instance: T): InstanceData<T> {
    // Can object serialize itself?
    if (isSerializeable(instance)) {
      return instance.serialize(world);
    }

    const data: InstanceData<T> = {};

    for (const key in instance) {
      if (isIgnored(instance, key)) {
        continue;
      }

      const value = this.serializeValue(world, instance[key]);

      if (value !== undefined) {
        data[key] = value;
      }
    }

    return data;
  }

  /** @internal */
  private serializeObject<T extends object>(world: World, instance: T): InstanceData<T> | TypeData<T> {
    const data = this.serializeObjectData(world, instance);

    // Check if we have a type ID.
    if (hasTypeId(instance.constructor)) {
      return {
        $id: getTypeId(instance.constructor), $data: data
      };
    }

    return data;
  }

  /** @internal */
  private serializeArray<T>(world: World, array: T[]): unknown[] {
    const serialized = [];

    for (const item of array) {
      const value = this.serializeValue(world, item);

      if (value !== undefined) {
        serialized.push(value);
      }
    }

    return serialized;
  }

  /** @internal */
  private serializeValue(world: World, value: unknown): unknown {
    const type = typeof value;

    // Undefined values, functions & symbols are not serialized.
    if (value === undefined || value === null || type === 'function' || type === 'symbol') {
      return;
    }

    if (type === 'object') {
      return Array.isArray(value)
        ? this.serializeArray(world, value)
        : this.serializeObject(world, value);
    }

    // Type is a primitive and can safely be returned as-as.
    return value;
  }

  /**
   * Serializes the given class `instance`. If the instance implements {@link Serialize},
   * it will be serialized using that custom implementation. Throws an error when the
   * instance type does not have a type id.
   */
  public serialize<T extends object>(world: World, instance: T): TypeData<T> {
    if (! hasTypeId(instance.constructor)) {
      throw new Error('Instance type has no type ID.');
    }

    // Safety: This will always contain type-data as the initial type that is being
    // serialized is guaranteed to have a type ID.
    return this.serializeObject(world, instance) as TypeData<T>;
  }

  /**
   * Deserializes the given type `data`. If the instance implements {@link Deserialize},
   * it will be deserialized using that custom implementation.
   */
  public deserialize<T extends object>(world: World, data: TypeData<T>): T {
    const type = getTypeFromId(data.$id);

    // Safety: Sadly there is no way to correctly check if the typing matches at runtime.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, new-cap
    const instance = new type();

    if (isDeserializeable<InstanceData<T>>(instance)) {
      instance.deserialize(world, data.$data);
    }
    else {
      for (const key in data.$data) {
        const value = data.$data[ key ];

        instance[ key ] = isTypeData(value)
          ? this.deserialize(world, value) : data.$data[ key ];
      }
    }

    return instance;
  }

}
