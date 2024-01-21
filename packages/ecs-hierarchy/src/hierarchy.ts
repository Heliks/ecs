import { Entity, World } from '@heliks/ecs';

/** Scene-graph like hierarchy for entities. */
export class Hierarchy {

  /**
   * Contains children mapped to their parent. Do not modify this directly unless you
   * know what you are doing, otherwise the hierarchy is not guaranteed.
   */
  public readonly children = new Map<Entity, Entity[]>();

  /** Adds a `child` entity to a `parent`. */
  public addChild(parent: Entity, child: Entity): void {
    let children = this.children.get(parent);

    // Create new array if it didn't exist previously.
    if (!children) {
      children = [];

      this.children.set(parent, children);
    }

    children.push(child);

    this.children.set(parent, children);
  }

  /**
   * Removes a `child` from a `parent` entity. Returns `true` if the removal was
   * successful.
   */
  public removeChild(parent: Entity, child: Entity): boolean {
    const children = this.children.get(parent);

    if (children) {
      const index = children.indexOf(child);

      if (~index) {
        children.splice(index, 1);

        return true;
      }
    }

    return false;
  }

  /** Removes `entity` from the hierarchy. */
  public remove(entity: Entity): void {
    // Remove entity from parents.
    for (const parent of this.children.keys()) {
      if (this.removeChild(parent, entity)) {
        break;
      }
    }

    // Remove entity as a parent.
    this.children.delete(entity);
  }

  /** Returns a flat hierarchy of all entities below `parent`. */
  public flat(parent: Entity, result: Entity[] = []): Entity[] {
    const children = this.children.get(parent);

    if (children) {
      for (const child of children) {
        result.push(child);

        this.flat(child, result);
      }
    }

    return result;
  }

  /**
   * Destroys the given {@link entity} and all of its ancestors. Entities are destroyed
   * from bottom to up, which means that children are destroyed before their parents.
   *
   * ```ts
   *  const hierarchy = new Hierarchy();
   *
   *  const entity1 = world.insert();
   *  const entity2 = world.insert();
   *
   *  // Set entity2 as child of entity1.
   *  hierarchy.addChild(entity1, entity2);
   *
   *  // entity2 is destroyed first.
   *  hierarchy.destroy(world, entity1);
   * ```
   */
  public destroy(world: World, entity: Entity): this {
    const children = this.children.get(entity);

    if (children) {
      for (const child of children) {
        this.destroy(world, child);
      }

      // Drop child references.
      this.children.delete(entity);
    }

    world.destroy(entity);

    return this;
  }

}
