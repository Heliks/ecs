import { Entity, Query, Storage, System, World } from '@heliks/ecs';
import { Hierarchy, Parent } from '@heliks/ecs-hierarchy';
import { Transform } from './transform';


// Todo: WIP!
export class TransformSystem implements System {

  /**
   * Query that matches all top level entities (e.g. all entities that are not the child
   * of another entity). This is only available after {@link boot} has been called.
   */
  public query!: Query;

  /** @internal */
  private parents!: Storage<Parent>;

  /** @internal */
  private transforms!: Storage<Transform>;

  /**
   * @param hierarchy The entity hierarchy that should be used to determine parent-
   *  child relationships.
   */
  constructor(public readonly hierarchy: Hierarchy) {}

  /** @inheritDoc */
  public boot(world: World): void {
    this.parents = world.storage(Parent);
    this.transforms = world.storage(Transform);

    this.query = world
      .query()
      .contains(Transform)
      .excludes(Parent)
      .build();
  }

  /** Recursively updates the transform values of an entity and it's children. */
  public transform(entity: Entity): void {
    const children = this.hierarchy.children.get(entity);
    const transform = this.transforms.get(entity);

    if (children) {
      for (const child of children) {
        const ct = this.transforms.get(child);

        ct.world.x = ct.local.x + transform.world.x;
        ct.world.y = ct.local.y + transform.world.y;

        this.transform(child);
      }
    }
  }

  /** @inheritDoc */
  public update(): void {
    for (const entity of this.query.entities) {

      
      console.log('HALLO', this.query.entities)

      this.transform(entity);
    }
  }

}
