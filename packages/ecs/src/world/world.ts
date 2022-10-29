import { Changes, ComponentType, Entity, EntityManager } from '../entity';
import { MapStorage, Storage } from '../storage';
import { LazyBuilder } from './lazy-builder';
import { Builder } from './builder';
import { World as Base } from './types';
import { QueryBuilder, QueryManager } from '../query';


export class World implements Base {

  /** @see Changes */
  public readonly changes = new Changes();

  /** @see EntityManager */
  public readonly entities = new EntityManager(this.changes);

  /** @see QueryManager */
  public readonly queries = new QueryManager();

  /**
   * Contains all registered component storages, mapped to the component type which
   * they are storing.
   */
  protected readonly storages = new Map<ComponentType, Storage<unknown>>();

  /**
   * Contains component types that are detached from an entity, and the entities from
   * which they are detached from. The layout of this array looks like this:
   *
   * `[Entity, ComponentType, Entity, ComponentType]`.
   *
   * @see detach
   */
  private detachments: (Entity | ComponentType)[] = [];

  /** @inheritDoc */
  public register<T>(type: ComponentType<T>): Storage<T> {
    let storage = this.storages.get(type) as Storage<T>;

    if (storage) {
      return storage;
    }

    const id = this.entities.components.register(type);

    storage = new MapStorage<T>(id, this.changes, type);

    this.storages.set(type, storage);

    return storage;
  }

  /** @inheritDoc */
  public storage<T>(component: ComponentType<T>): Storage<T> {
    const storage = this.storages.get(component) as MapStorage<T>;

    return storage ? storage : this.register(component);
  }

  /** @inheritDoc */
  public registerAs<A, C extends A>(component: ComponentType<C>, as: ComponentType<A>): Storage<A> {
    const storage = this.storage(as);

    this.storages.set(component, storage);

    return storage;
  }

  /** @inheritDoc */
  public alive(entity: Entity): boolean {
    return this.entities.alive(entity);
  }

  /** @inheritDoc */
  public create(...components: object[]): Entity {
    const entity = this.entities.create();

    if (components) {
      for (const component of components) {
        this.storage(component.constructor as ComponentType).set(entity, component);
      }
    }

    return entity;
  }

  /** @inheritDoc */
  public destroy(entity: Entity): this {
    if (this.entities.destroy(entity)) {
      this.changes.destroy(entity);
    }

    return this;
  }

  /** @internal */
  private removeDetachedComponents(): void {
    let i = 0;

    while (i < this.detachments.length) {
      const entity = this.detachments[i++] as Entity;
      const type = this.detachments[i++] as ComponentType;

      this
        .storage(type)
        .remove(entity);
    }
  }

  /**
   * Detaches the component instance of the given `type` from an `entity`.
   *
   * Components that are detached can still be accessed via the appropriate component
   * storage like normal, but will be removed on the next world {@link update()}. This
   * is useful if a component needs to be removed from an entity lazily.
   */
  public detach(entity: Entity, type: ComponentType): this {
    this.detachments.push(entity, type);

    return this;
  }

  /**
   * Returns a builder with which an entity query can be created.
   *
   * @see QueryBuilder
   */
  public query(): QueryBuilder {
    return new QueryBuilder(this.entities, this.queries);
  }

  /**
   * Returns an entity builder with which entities can be composed. The entity is
   * created and added to the world instantly.
   *
   * @see Builder
   */
  public builder(): Builder {
    return new Builder(this.create(), this);
  }

  /**
   * Returns an entity builder with which entities can be composed. The entity will be
   * created and added to the world only after the `build()` method has been called.
   *
   * @see LazyBuilder
   */
  public lazy(): LazyBuilder {
    return new LazyBuilder(this);
  }

  /** Updates the entity world. Should be called once per frame. */
  public update(): void {
    this.removeDetachedComponents();

    this.queries.sync(this.changes);
    this.changes.clear();
  }

}

