import { Changes, ComponentType, Entity, EntityManager } from '../entity';
import { MapStorage, Storage } from '../storage';
import { LazyBuilder } from './lazy-builder';
import { EntityBuilder } from './entity-builder';
import { World as Base } from './types';
import { QueryBuilder, QueryManager } from '../query';


/** @inheritDoc*/
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
  public alive(entity: Entity): boolean {
    return this.entities.alive(entity);
  }

  /** @inheritDoc */
  public insert(...components: object[]): Entity {
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
   * @see EntityBuilder
   */
  public create(): EntityBuilder {
    return new EntityBuilder(this, this.insert());
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
    this.queries.sync(this.changes);
    this.changes.drop();
  }

  /** Drops all existing entities. */
  public drop(): this {
    for (const entity of this.entities.entities) {
      this.destroy(entity);
    }

    return this;
  }

}
