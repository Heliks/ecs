import { ComponentList, ComponentType, Entity, EntityBuilder, World } from '@heliks/ecs';
import { SerializationQuery } from './serialization-query';
import { TypeSerializer } from './type-serializer';
import { EntityData, EntitySerializer as Base, TypeData } from './types';
import { hasTypeId } from './type-registry';


/**
 * Provides functionality for entity (de-)serialization.
 *
 * Given an {@link Entity}, all components of that entity with a {@link UUID type ID},
 * will be serialized using the {@link TypeSerializer}.
 */
export class EntitySerializer implements Base {

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
    if (store.has(entity) && hasTypeId(store.type)) {
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
      components.push(this.types.serialize(world, component));
    }

    return {
      components
    };
  }

  /** @inheritDoc */
  public serialize(world: World, entity: Entity, components?: Set<ComponentType>): EntityData {
    // If no whitelist is specified, use all components.
    if (! components) {
      components = world.components();
    }

    return {
      components: this.serializeEntityComponents(
        world,
        entity,
        components ? components : world.components()
      )
    };
  }

  /** @inheritDoc */
  public deserialize(world: World, data: EntityData): Entity {
    const builder = this.create(world, data);

    if (data.components) {
      for (const typeData of data.components) {
        builder.use(this.types.deserialize(world, typeData));
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
