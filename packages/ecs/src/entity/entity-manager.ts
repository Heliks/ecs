import { Changes } from './changes';
import { Entity, ENTITY_BITS, ENTITY_MASK } from './entity';
import { ComponentRegistry } from './component-registry';


/**
 * Manages entities.
 *
 * @see Entity
 */
export class EntityManager {

  /** {@see ComponentRegistry} */
  public readonly components = new ComponentRegistry();

  /**
   * Contains all entities. Dead or alive.
   *
   * Technically, each entity here counts as {@link alive}, even if it isn't. This is
   * because entities which are destroyed, are kept "not-yet-alive" until they can be
   * recycled. To iterate over all living entities, a {@link Query} can be used instead.
   */
  public readonly entities: Entity[] = [];

  /** Contains entities that can be recycled. */
  private readonly free: Entity[] = [];

  /**
   * @param changes Change-set used to track entity modifications.
   */
  constructor(public readonly changes = new Changes()) {}

  /** Creates a new entity and returns it. */
  public create(): Entity {
    let entity = this.free.pop();

    if (entity) {
      return entity;
    }

    // Entity is the next available index. Assigning an integer will cause this to
    // have a version of 0.
    entity = this.entities.length;

    if (entity > ENTITY_MASK) {
      throw new Error('Maximum amount reached');
    }

    this.entities.push(entity);
    this.changes.add(entity);

    return entity;
  }

  /**
   * Returns the entity at the `index` position. This also includes entities that are
   * no longer alive. Throws an error if no entity exists at that index.
   */
  public get(index: number): Entity {
    const entity = this.entities[index];

    // `0` is a valid entity.
    if (entity === undefined) {
      throw new Error('Out of bounds.');
    }

    return entity;
  }

  /** Returns `true` if `entity` is not destroyed. */
  public alive(entity: Entity): boolean {
    // Compare the given entity with the one that currently occupies its index. When
    // their versions don't match, this will fail, indicating that the given entity
    // is no longer alive.
    return this.entities[entity & ENTITY_MASK] === entity;
  }

  /** Destroys an `entity`. */
  public destroy(entity: Entity): this {
    if (this.alive(entity)) {
      const index = entity & ENTITY_MASK;

      // Increase version by 1 and queue entity for recycling.
      this.free.push(
        this.entities[index] = (index | ((entity >> ENTITY_BITS) + 1) << ENTITY_BITS)
      );
    }

    return this;
  }

  /** Returns `true` if the given entity is freed to be re-used. */
  public isFree(entity: Entity): boolean {
    return this.free.includes(entity);
  }

  /** Drops all entities. */
  public drop(): this {
    this.entities.length = 0;
    this.free.length = 0;

    return this;
  }

}
