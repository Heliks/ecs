import { ComponentEventType, System, World } from '@heliks/ecs';
import { Subscriber } from '@heliks/event-queue';
import { Parent } from './parent';
import { Hierarchy } from './hierarchy';

/** System that maintains parent-child relationships between entities. */
export class HierarchySystem implements System {

  /** @internal */
  private subscriber!: Subscriber;

  /** The hierarchy that should be used internally. */
  constructor(public readonly hierarchy = new Hierarchy()) {}

  /** @inheritDoc */
  public boot(world: World): void {
    this.subscriber = world.storage(Parent).subscribe();
  }

  /** @inheritDoc */
  public update(world: World): void {
    const storage = world.storage(Parent);

    for (const event of storage.events(this.subscriber)) {
      switch (event.type) {
        case ComponentEventType.Added:
          this.hierarchy.addChild(storage.get(event.entity).entity, event.entity);
          break;
        case ComponentEventType.Removed:
          this.hierarchy.remove(event.entity);

          break;
      }
    }
  }

}
