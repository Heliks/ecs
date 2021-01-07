import { Entity, EntityGroup, Storage, System, World } from '@heliks/ecs';
import { Hierarchy, Parent } from '@heliks/ecs-hierarchy';
import { Transform } from './transform';

// Todo: WIP!
export class TransformSystem implements System {

  /**
   * Stores all top-level entities e.g. all entities that have a `Parent` component but
   * no `Transform`.
   */
  private group!: EntityGroup;

  /**
   * @param hierarchy The entity hierarchy that should be used to determine parent-
   *  child relationships.
   */
  constructor(public readonly hierarchy: Hierarchy) {}

  /** @inheritDoc */
  public boot(world: World): void {
    this.group = world.query({
      contains: [Transform],
      excludes: [Parent]
    });
  }

  /** @internal */
  private transform(transforms: Storage<Transform>, parents: Storage<Parent>, entities: Entity[]): void {
    for (const entity of entities) {
      const children = this.hierarchy.children.get(entity);

      if (children) {
        for (const child of children) {
          const ct = transforms.get(child);
          const pt = transforms.get(parents.get(child).entity);

          ct.world.x = ct.local.x + pt.world.x;
          ct.world.y = ct.local.y + pt.world.y;
          ct.world.z = ct.local.z + pt.world.z;

          // Get the children of the child and traverse them also.
          const _children = this.hierarchy.children.get(child);

          if (_children) {
            this.transform(transforms, parents, _children);
          }
        }
      }
    }
  }

  /** @inheritDoc */
  public update(world: World): void {
    this.transform(
      world.storage(Transform),
      world.storage(Parent),
      this.group.entities
    );
  }

}
