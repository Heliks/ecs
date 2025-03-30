/** A type that an object is an instance of. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Type<T = any> = new (...params: any[]) => T;

/** In JS, functions can be used as constructors as well. */
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type Ctor<T = any> = Type<T> | Function;

/** A static type ID used to resolve a class type. */
export type TypeId = string;

const ID_STORE = new Map<Type, TypeId>();
const ID_KNOWN = new Set<TypeId>();

/** @internal */
export function getTypeId(type: Ctor): TypeId {
  const id = ID_STORE.get(type as Type);

  if (! id) {
    throw new Error(`No UUID for type ${type.toString()}`);
  }

  return id;
}

/**
 * Assigns a `id` as {@link TypeId} to the decorated type. Throws an error if that ID
 * is already in use.
 *
 * Type IDs are used internally to deserialize typed data. Therefore, they must be
 * static and should never change between application launches or be dynamic in any
 * other way. Changing existing Type IDs on live applications or during development
 * will break backwards compatibility with previously serialized data.
 *
 * ```ts
 *  @ID('foo')
 *  class MyType {}
 * ```
 *
 * Types additionally need to be registered on the {@link TypeStore} to fully enable
 * serialization. While technically not required, this makes sure that all types that
 * have been assigned an ID in the consumer application, are imported and not removed
 * by the bundler on accident.
 */
export function TypeId(id: TypeId): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function annotateTypeId(target: Function): void {
    if (ID_KNOWN.has(id)) {
      throw new Error(`Id ${id} is already used by another type.`);
    }

    ID_STORE.set(target as Type, id);
    ID_KNOWN.add(id);
  }
}

