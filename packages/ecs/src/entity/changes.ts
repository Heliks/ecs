import { BitSet } from '../common';
import { Entity } from './entity';

/**
 * A bit set that contains the Ids of all components that are contained in this
 * composition. The change-set will keep track of every composition of every entity.
 */
export type Composition = BitSet;

/**
 * A bit representing the existence of a component type.
 *
 * @see Composition
 */
export type CompositionBit = number;

/**
 * Change-set that keeps track of modified entities.
 *
 * The change-set will store a composition for each entity, and if modified will push
 * that entity in a queue that can then be processed by other systems.
 *
 * @see Composition
 */
export class Changes {

  /**
   * Entities that were updated during this frame, either through component addition
   * or removal.
   * Note: Do not modify this directly.
   */
  public readonly changed: Entity[] = [];

  /**
   * Entities that were destroyed during this frame.
   * Note: Do not updated this directly.
   */
  public readonly destroyed: Entity[] = [];

  /**
   * Bit-sets that represent the component composition of an entity.
   *
   * @see Composition
   * @see CompositionBit
   */
  private readonly compositions = new Map<Entity, Composition>();

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
  private setDirty(entity: Entity): void {
    if (!this.changed.includes(entity)) {
      this.changed.push(entity);
    }
  }

  /** Adds a composition `bit` to `entity`. */
  public add(entity: Entity, bit: CompositionBit): void {
    this.composition(entity).add(bit);
    this.setDirty(entity);
  }

  /** Removes a composition `bit` to `entity`. */
  public remove(entity: Entity, bit: CompositionBit): this {
    if (this.composition(entity).remove(bit)) {
      this.setDirty(entity);
    }

    return this;
  }

  /** Flags an entity as "destroyed". */
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
