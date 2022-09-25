import { Storage } from './storage'
import { EventQueue, Subscriber } from '@heliks/event-queue';
import { Changes, ComponentEvent, ComponentEventType, ComponentType, Entity } from '../entity';


/** Entity storage that stores component in a `Map`. */
export class MapStorage<T = unknown> implements Storage<T> {

  /** The event queue to which this storage will push events. */
  private readonly _events = new EventQueue<ComponentEvent<T>>();

  /** Contains all component instances mapped to the entity to which they belong. */
  private readonly componentLookup = new Map<Entity, T>();

  /** Reverse lookup that matches a component instance to an entity. */
  private readonly componentsReverseLookup = new Map<T, Entity>();

  /**
   * @param id Unique id of the storage.
   * @param changes Change-set that keeps track of entity changes.
   * @param type The component type that this storage is storing.
   */
  constructor(
    public readonly id: number,
    public readonly changes: Changes,
    public readonly type: ComponentType<T>
  ) {}

  /** @inheritDoc */
  public components(): IterableIterator<T> {
    return this.componentLookup.values();
  }

  /** @inheritDoc */
  public entities(): IterableIterator<Entity> {
    return this.componentLookup.keys();
  }

  /** @inheritDoc */
  public set(entity: Entity, component: T): this {
    this.componentLookup.set(entity, component);
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
    const component = this.componentLookup.get(entity) as T;

    if (! component) {
      throw new Error(`${entity} does not have a ${this.type.name} component`);
    }

    return component;
  }

  /** @inheritDoc */
  public remove(entity: Entity): boolean {
    if (this.componentLookup.has(entity)) {
      const component = this.get(entity);

      this.componentLookup.delete(entity);
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
    const component = this.componentLookup.get(entity);

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
    return this.componentLookup.has(entity);
  }

  /** @inheritDoc */
  public drop(): void {
    for (const entity of this.componentLookup.keys()) {
      this.changes.remove(entity, this.id);
    }

    this.componentLookup.clear();
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
