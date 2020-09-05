import { Entity, EntityGroup, Storage, System, World } from '@heliks/ecs';
import { Hierarchy, Parent } from '@heliks/hierarchy';
import { Transform } from './transform';

// Todo: While file is a prototype.

export class TransformSystem implements System {

  /** @internal */
  private hierarchy!: Hierarchy;

  /** A group that collects all entities without a parent. */
  private topLevel!: EntityGroup;

  /** @inheritDoc */
  public boot(world: World): void {
    this.hierarchy = new Hierarchy(world.storage(Parent));

    console.log(world.storage(Parent))

    // Store a group over all top-level entities (e.g. entities that don't have
    // a parent).
    this.topLevel = world.query({
      contains: [ Transform ],
      excludes: [ Parent ]
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

          cTransform.world[0] = cTransform.local[0] + pTransform.world[0];
          cTransform.world[1] = cTransform.local[1] + pTransform.world[1];

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
    const transforms = world.storage(Transform);
    const parents = world.storage(Parent);

    // Maintain the entity hierarchy.
    this.hierarchy.update();

    // for (const entity of this.topLevel.entities) {
    //   const transform = transforms.get(entity);

    // Entities without a parent have the same local position as world. Synchronize them
    // if their locals have changed.
    // if (transform.isLocalDirty) {
    //  transform.world[0] = transform.local[0];
    //  transform.world[1] = transform.local[1];

    //  transform.isLocalDirty = false;
    // }
    // }

    this.transform(transforms, parents, this.topLevel.entities);
  }

}
