/** A type that an object is an instance of. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Type<T = any> = new (...params: any[]) => T;

/** In JS, functions can be used as constructors as well. */
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type Ctor<T = any> = Type<T> | Function;

/** String that contains a 128-bit UUID (Universally unique identifier). */
export type UUID = string;

/** Maps class {@link Type types} a {@link UUID}. */
const ID_STORE = new Map<Type, UUID>();

/** Reverse mapping of {@link ID_STORE}. */
const ID_STORE_REVERSE = new Map<UUID, Type>();

/**
 * Sets `id` as the type ID of `type`. Throws an error if that ID is already in use
 * by another type.
 */
export function setTypeId(type: Ctor, id: UUID): void {
  if (ID_STORE_REVERSE.has(id)) {
    throw new Error(`Id ${id} is already used by another type.`);
  }

  ID_STORE.set(type as Type, id);
  ID_STORE_REVERSE.set(id, type as Type);
}

/** Returns the type ID of `type`. Throws an error if that type does not have an ID. */
export function getTypeId(type: Ctor): UUID {
  const id = ID_STORE.get(type as Type);

  if (! id) {
    throw new Error(`No UUID for type ${type.toString()}`);
  }

  return id;
}

/** Returns `true` if `type` has a {@link UUID id} assigned to it. */
export function hasTypeId(type: Ctor): boolean {
  return ID_STORE.has(type as Type);
}

/**
 * Returns the {@link Type} that belongs to `id`. Throws an error if that id does not
 * map to any type.
 */
export function getTypeFromId(id: UUID): Type {
  const type = ID_STORE_REVERSE.get(id);

  if (! type) {
    throw new Error(`Invalid type ID ${id}`);
  }

  return type;
}

/**
 * Clears the type ID storage.
 *
 * Only used for testing purposes.
 */
export function clearTypeIds(): void {
  ID_STORE.clear();
  ID_STORE_REVERSE.clear();
}

/**
 * Decorator that assigns the given `id` as type ID to a class type. Throws an error if
 * that ID is already in use by a different type.
 *
 * Type IDs are used to index class types. Therefore, they are supposed to be static
 * and should not change between application launches.
 *
 * ```ts
 *  @UUID('0000-0000-0000-0000')
 *  class Foo {}
 * ```
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function UUID(id: UUID): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function annotateTypeId(target: Function): void {
    setTypeId(target, id);
  }
}
