import { Entity } from './entity';
import { ComponentId } from './component';
import { Composition } from './composition';


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

    item = new Composition();

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
    this.setDirty(entity).composition(entity).set(id);

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

  /** Drops all changes. Should be called once at the end of each frame. */
  public drop(): void {
    this.changed.length = 0;
    this.destroyed.length = 0;
  }

}
