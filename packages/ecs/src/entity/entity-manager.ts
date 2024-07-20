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
   * Contains all existing entities, both living and destroyed.
   *
   * Each entity in this array *technically* counts as {@link alive}, even if it's
   * not. This is because entities which are destroyed are kept in a not-yet-alive
   * state until they can be re-used.
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
    // Attempt to recycle a previously destroyed entity which minimizes garbage collection
    // and small frame delays that could be caused by it.
    let entity = this.free.pop();

    if (entity) {
      return entity;
    }

    // If we can't recycle, we simply initialize this with the next index, which will
    // automatically set the version to 0.
    entity = this.entities.length;

    // If we are out of bits on the index part we can't create a new entity.
    if (entity > ENTITY_MASK) {
      throw new Error('Maximum amount reached');
    }

    this.entities.push(entity);

    return entity;
  }

  /**
   * Returns the entity at the `index` position. This also includes destroyed entities.
   * Throws an error if no entity exists at that index.
   */
  public get(index: number): Entity {
    const entity = this.entities[index];

    // This hard check is required because the first entity will be "0", which would
    // cause the ! operator to produce a false positive here.
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

      // Increment the version of the entity and mark the index as free so that it
      // can be recycled by the next entity that is created.
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
