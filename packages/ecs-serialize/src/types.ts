import { ComponentList, ComponentType, Entity, PresetId, World } from '@heliks/ecs';
import { UUID } from './type-registry';


export type InstanceData<T> = {
  [K in keyof T]?: unknown;
}

/** Data structure for a serialized class type. */
export interface TypeData<T = unknown> {
  /** Id of the class type that was serialized. */
  $id: UUID;
  /** Contains the actual serialized data of the type instance. */
  $data: InstanceData<T>;
}

/** A class that implements this type can be serialized. */
export interface Serialize<D> {
  /** Called when the {@link TypeSerializer type serializer} attempts to serialize this class. */
  serialize(world: World): D;
}

/** A class that implements this type can be deserialized. */
export interface Deserialize<D> {

  /**
   * The {@link TypeSerializer type serializer} will call this after creating the class
   * instance.
   */
  deserialize(world: World, data: D): void;

}

/**
 * A class that implements this type can both be serialized and deserialized.
 *
 * @see Serialize
 * @see Deserialize
 */
export interface Serializeable<D> extends Serialize<D>, Deserialize<D> {}

/**
 * Data structure for serialized entities.
 *
 * This object is expected to be stringify-able via `JSON.stringify()`. If it isn't, or
 * the data can not be properly de-serialized, the serializer that produced this data
 * is most likely broken.
 */
export interface EntityData {

  /**
   * If defined, the entity preset matching this {@link PresetId preset ID} will be used
   * as basis when this data is de-serialized.
   */
  preset?: PresetId;

  /**
   * If defined, each set of {@link TypeData component data} will be de-serialized
   * and the resulting component will be attached to the entity.
   */
  components?: TypeData[];

}

/** (De-)serializes entities. */
export interface EntitySerializer<W extends World = World> {

  /**
   * Serializes an `entity`.
   *
   * The serializer will serialize all components with a {@link UUID type id} that are
   * attached to the entity. If a list of `components` is provided, only the component
   * types in that list will be serialized.
   *
   * Components without type IDs will always be ignored.
   *
   * @param world World in which the entity exists.
   * @param entity Entity that should be serialized.
   * @param components (optional) List of component types that should be serialized.
   */
  serialize(world: W, entity: Entity, components?: Set<ComponentType>): EntityData;

  /**
   * Deserializes {@link EntityData entity data} and produces an entity.
   *
   * @param world World in which the deserialized entity should be created.
   * @param data Entity data to deserialize.
   */
  deserialize(world: W, data: EntityData): Entity;

  /** Serializes the given component `list` into {@link EntityData}. */
  list(world: W, list: ComponentList): EntityData;

  /** Extracts and deserializes all components in the given entity `data`. */
  extract(world: W, data: EntityData): ComponentList;

}
