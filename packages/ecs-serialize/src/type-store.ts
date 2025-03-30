import { getTypeId, Type, TypeId } from './type-id';

/**
 * This database holds all known types that the {@link TypeSerializer} is able
 * to (de-)serialize.
 */
export class TypeStore {

  /** @internal */
  private readonly entries = new Map<Type, TypeId>();

  /** @internal */
  private readonly reverse = new Map<TypeId, Type>();

  /** Returns `true` if `type` is a known type. */
  public exists(type: Type): boolean {
    return this.entries.has(type);
  }

  /**
   * Registers the given `type`. The {@link TypeId} for this type will be resolved
   * from the type meta-data.
   */
  public add(type: Type): this {
    const id = getTypeId(type);

    this.entries.set(type, id);
    this.reverse.set(id, type);

    return this;
  }

  /**
   * Registers the given `type`, using `id` as its {@link TypeId}. Throws an error if
   * that ID is already in use.
   */
  public set(type: Type, id: TypeId): this {
    if (this.reverse.has(id)) {
      throw new Error(`Type ID ${id} is already in use.`);
    }

    this.entries.set(type, id);
    this.reverse.set(id, type);

    return this;
  }

  /**
   * Returns the {@link TypeId} of the given `type`. Throws an error if no type ID
   * is known for that type.
   */
  public id(type: Type): TypeId {
    const id = this.entries.get(type);

    if (! id) {
      throw new Error(`Unregistered type ${type.name}`);
    }

    return id;
  }

  /**
   * Returns the {@link Type} that is registered under the given type `id. Throws an
   * error if that ID doesn't belong to any known type.
   */
  public type<T = any>(id: TypeId): Type<T> {
    const type = this.reverse.get(id);

    if (! type) {
      throw new Error(`Unknown type ${id}`);
    }

    return type;
  }

  /**
   * Creates an instance of the typed object matching `id`. Throws an error if that ID
   * doesn't belong to any known type.
   */
  public create<T = any>(id: TypeId): T {
    return new (this.type(id))();
  }

  /**
   * Drops the entire type store.
   */
  public clear(): this {
    this.entries.clear();
    this.reverse.clear();

    return this;
  }

}
