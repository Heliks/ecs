import { ComponentList, ComponentType, Entity, EntityBuilder, World } from '@heliks/ecs';
import { SerializationQuery } from './serialization-query';
import { TypeSerializer } from './type-serializer';
import { EntityData, EntitySerializer as Base, TypeData } from './types';
import { Opaque } from './opaque';


/**
 * Provides functionality for entity (de-)serialization.
 *
 * ### Opaque data
 *
 * When deserializing, {@link TypeData} with an unknown {@link TypeId} is preserved
 * inside a {@link Opaque} component. This allows entities to be deserialized and
 * serialized again without any data loss.
 *
 * When an entity containing an {@link Opaque} component is serialized, its data is
 * unpacked and included as normal {@link TypeData}.
 */
export class EntitySerializer implements Base {

  /** @internal */
  private readonly _opaque: TypeData[] = [];

  /**
   * @param types {@see TypeSerializer}
   */
  constructor(public readonly types: TypeSerializer) {}

  /**
   * Returns an {@link EntityBuilder} for the given entity `data`. If the data contains
   * a preset, it will be used as basis to create the builder.
   */
  public create(world: World, data: EntityData): EntityBuilder {
    // Start composition with preset if one was defined.
    return data.preset ? world.presets.create(world, data.preset) : world.create();
  }

  /** @internal */
  private serializeEntityComponent<T>(world: World, entity: Entity, component: ComponentType<T>): TypeData<T> | undefined {
    const store = world.storage(component);

    // Only serialize components that have a type ID.
    if (store.has(entity) && this.types.store.has(store.type)) {
      return this.types.serialize(world, store.get(entity) as object);
    }
  }

  /**
   * Serializes all components of `entity` that are included in the given `component`
   * list. Components that do not have a type ID will be ignored.
   */
  public serializeEntityComponents(world: World, entity: Entity, components: Set<ComponentType>): TypeData[] {
    const results = [];

    for (const component of components) {
      const data = this.serializeEntityComponent(world, entity, component);

      if (data) {
        results.push(data);
      }
    }

    return results;
  }

  /** @inheritDoc */
  public list(world: World, list: ComponentList): EntityData {
    const components = [];

    for (const component of list.all()) {
      if (this.types.serializeable(component)) {
        components.push(this.types.serialize(world, component));
      }
    }

    return {
      components
    };
  }

  /** @inheritDoc */
  public serialize(world: World, entity: Entity, components?: Set<ComponentType>): EntityData {
    const data = this.serializeEntityComponents(world, entity, components ? components : world.components())
    const store = world.storage(Opaque);

    // Unpack opaque data, if any.
    if (store.has(entity)) {
      data.push(...store.get(entity).data);
    }

    return {
      components: data
    };
  }

  /** @inheritDoc */
  public deserialize(world: World, data: EntityData): Entity {
    this._opaque.length = 0;

    const builder = this.create(world, data);

    if (data.components) {
      for (const item of data.components) {
        if (this.types.store.hasId(item.$id)) {
          builder.use(this.types.deserialize(world, item));
        }
        else {
          this._opaque.push(item);
        }
      }

      if (this._opaque.length > 0) {
        builder.use(
          new Opaque([
            ...this._opaque
          ])
        );
      }
    }

    return builder.build();
  }

  /** @inheritDoc */
  public extract(world: World, data: EntityData): ComponentList {
    const list = new ComponentList();

    if (data.components) {
      for (const typeData of data.components) {
        list.add(this.types.deserialize(world, typeData));
      }
    }

    return list;
  }

  /** Returns a {@link SerializationQuery}. */
  public query(world: World): SerializationQuery {
    return new SerializationQuery(world, this);
  }

}
