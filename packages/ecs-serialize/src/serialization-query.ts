import { ComponentType, QueryBuilder, World } from '@heliks/ecs';
import { EntityData, EntitySerializer } from './types';


/**
 * Queries entities with a specific set of components to serialize them all at once.
 *
 * This uses a normal {@link QueryBuilder entity query} internally and is therefore
 * functionally similar.
 */
export class SerializationQuery {

  /** @internal */
  private query: QueryBuilder;

  /**
   * @param world Entity world from which entities are queried & serialized.
   * @param serializer Serializer to serialize entities with.
   */
  constructor(
    private readonly world: World,
    private readonly serializer: EntitySerializer
  ) {
    this.query = world.query();
  }

  /** @see QueryBuilder.contains */
  public contains(type: ComponentType): this {
    this.query.contains(type);

    return this;
  }

  /** @see QueryBuilder.excludes */
  public excludes(type: ComponentType): this {
    this.query.excludes(type);

    return this;
  }

  /**
   * Serializes all entities that match the query and returns their serialized entity
   * data as an array.
   */
  public serialize(): EntityData[] {
    const data = [];
    const query = this.query.build();

    for (const entity of query.entities) {
      if (this.world.alive(entity)) {
        data.push(
          this.serializer.serialize(this.world, entity)
        );
      }
    }

    return data;
  }

}
