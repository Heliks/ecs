import { Storage } from './storage'
import { EventQueue, Subscriber } from '@heliks/event-queue';
import { Changes, ComponentEvent, ComponentEventType, ComponentType, Entity } from '../entity';

/**
 * Entity storage that stores component in a `Map`.
 */
export class MapStorage<T = unknown> implements Storage<T> {

  /** The event queue to which this storage will push events. */
  private readonly _events = new EventQueue<ComponentEvent<T>>();

  /** Contains all component instances mapped to the entity to which they belong. */
  private readonly components = new Map<Entity, T>();

  /** Reverse lookup that matches a component instance to an entity. */
  private readonly componentsReverseLookup = new Map<T, Entity>();

  /**
   * @param id Unique id of the storage.
   * @param type The component type that this storage is storing.
   * @param changes Change-set that keeps track of entity changes.
   */
  constructor(
    public readonly id: number,
    public readonly type: ComponentType<T>,
    public readonly changes: Changes
  ) {}

  /** @inheritDoc */
  public set(entity: Entity, component: T): this {
    this.components.set(entity, component);
    this.componentsReverseLookup.set(component, entity);

    this.changes.add(entity, this.id);

    this._events.push({
      component,
      entity,
      type: ComponentEventType.Added
    });

    return this;
  }

  /** @inheritDoc */
  public add(entity: Entity, data?: Partial<T>): T {
    // eslint-disable-next-line new-cap
    const component = new this.type();

    if (data) {
      Object.assign(component, data);
    }

    this.set(entity, component);

    return component;
  }

  /** @inheritDoc */
  public get(entity: Entity): T {
    const component = this.components.get(entity) as T;

    if (! component) {
      throw new Error(`No component found for entity ${entity}`);
    }

    return component;
  }

  /** @inheritDoc */
  public remove(entity: Entity): boolean {
    if (this.components.has(entity)) {
      const component = this.get(entity);

      this.components.delete(entity);
      this.componentsReverseLookup.delete(component);

      this.changes.remove(entity, this.id);

      this._events.push({
        component,
        entity,
        type: ComponentEventType.Removed
      });

      return true;
    }

    return false;
  }

  /** @inheritDoc */
  public update(entity: Entity, data: Partial<T>): this {
    const component = this.components.get(entity);

    if (component) {
      Object.assign(component, data);

      this._events.push({
        component,
        entity,
        type: ComponentEventType.Updated
      });
    }

    return this;
  }

  /** @inheritDoc */
  public has(entity: Entity): boolean {
    return this.components.has(entity);
  }

  /** @inheritDoc */
  public drop(): void {
    for (const entity of [...this.components.keys()]) {
      this.changes.remove(entity, this.id);
    }

    this.components.clear();
  }

  /** @inheritDoc */
  public subscribe(): Subscriber {
    return this._events.subscribe();
  }

  /** @inheritDoc */
  public events(subscriber: Subscriber): IterableIterator<ComponentEvent<T>> {
    return this._events.read(subscriber);
  }

  /** @inheritDoc */
  public owner(component: T): Entity | undefined {
    return this.componentsReverseLookup.get(component);
  }

  /** @internal */
  public toString(): string {
    return this.type.name;
  }

}
