import { BitSet } from '../common';
import { Entity } from './entity';
import { ComponentId } from './component';


/**
 * Bitset that contains the IDs of all components that are attached to an entity. The
 * change set will store a composition for all existing entities. Each entity can have
 * up to one instance of a component type.
 *
 * As this determines what type of components an entity owns, the ownership of a type is
 * effectively removed when its respective ID is removed from the composition, even if
 * the component is still stored somewhere else.
 *
 * @see Changes
 */
export type Composition = BitSet;

/**
 * Keeps track of changes to entity compositions.
 *
 * @see Composition
 */
export class Changes {

  /** Entities that had their composition changed. */
  public readonly changed: Entity[] = [];

  /** Entities that were removed from the world. */
  public readonly destroyed: Entity[] = [];

  /** @internal */
  private readonly compositions = new Map<Entity, Composition>();

  /**
   * Contains `true` if there are any modifications to an entity composition. This
   * includes entities that are destroyed.
   */
  public get dirty(): boolean {
    return this.changed.length > 0 || this.destroyed.length > 0;
  }

  /** Returns the composition of an entity. */
  public composition(entity: Entity): Composition {
    let item = this.compositions.get(entity);

    if (item) {
      return item;
    }

    item = new BitSet();

    this.compositions.set(entity, item);

    return item;
  }

  /** @internal */
  private setDirty(entity: Entity): this {
    if (! this.changed.includes(entity)) {
      this.changed.push(entity);
    }

    return this;
  }

  /**
   * Adds a component `id` to the component composition of `entity`, essentially flagging
   * the entity that it has a component of that type attached to it.
   */
  public add(entity: Entity, id: ComponentId): this {
    this.setDirty(entity).composition(entity).add(id);

    return this;
  }

  /**
   * Removes a component `id` from the composition of `entity`, essentially flagging the
   * entity that it no longer has a component of that type attached to it.
   */
  public remove(entity: Entity, bit: ComponentId): this {
    if (this.composition(entity).remove(bit)) {
      this.setDirty(entity);
    }

    return this;
  }

  /** Flags an entity as destroyed. */
  public destroy(entity: Entity): boolean {
    if (this.destroyed.includes(entity)) {
      return false;
    }

    this.destroyed.push(entity);

    return true;
  }

  /** Clears all changes. Should be called once at the end of each frame. */
  public clear(): void {
    this.changed.length = 0;
    this.destroyed.length = 0;
  }

}
