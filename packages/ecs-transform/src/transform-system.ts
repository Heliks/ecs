import { Entity, EntityGroup, Storage, System, World } from '@heliks/ecs';
import { Hierarchy, Parent } from '@heliks/ecs-hierarchy';
import { Transform } from './transform';

// Todo: WIP!
export class TransformSystem implements System {

  /** @internal */
  private hierarchy!: Hierarchy;

  /** Contains all entities with a `Transform` that *don't* have a `Parent` component. */
  private parentless!: EntityGroup;

  /** @inheritDoc */
  public boot(world: World): void {
    this.hierarchy = new Hierarchy(world.storage(Parent));

    // Store a group over all top-level entities (e.g. entities that don't have
    // a parent).
    this.parentless = world.query({
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
          const cTransform = transforms.get(child);
          const pTransform = transforms.get(parents.get(child).entity);

          cTransform.world.x = cTransform.local.x + pTransform.world.x;
          cTransform.world.y = cTransform.local.y + pTransform.world.y;

          cTransform.isLocalDirty = false;

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
    // Maintain the entity hierarchy.
    this.hierarchy.update();

    this.transform(
      world.storage(Transform),
      world.storage(Parent),
      this.parentless.entities
    );
  }

}
