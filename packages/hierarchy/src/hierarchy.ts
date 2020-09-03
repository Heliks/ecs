import { Subscriber } from '@heliks/event-queue';
import { ComponentEventType, Entity, Storage } from '@heliks/ecs';
import { Parent } from './parent';

/** Scene-graph like hierarchy for entities. */
export class Hierarchy {

  /**
   * Contains children mapped to their parent. Do not modify this directly unless you
   * know what you are doing, otherwise the hierarchy is not guaranteed.
   */
  public readonly children = new Map<Entity, Entity[]>();

  /** @internal */
  private readonly subscriber: Subscriber;

  /**
   * @param storage Storage for `Parent` components.
   */
  constructor(private readonly storage: Storage<Parent>) {
    this.subscriber = storage.events().subscribe();
  }

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
        // We don't need to save this back to "children" because we are working on the
        // original array reference.
        children.splice(index, 1);

        return true;
      }
    }

    return false;
  }

  public update(): void {
    const storage = this.storage;

    for (const event of storage.events().read(this.subscriber)) {
      const parent = storage.get(event.entity);

      if (ComponentEventType.Added === event.type) {
        // Added entities
        this.addChild(parent.entity, event.entity);
      }
      else {
        // Removed entities
        this.removeChild(parent.entity, event.entity);
      }
    }
  }

}
