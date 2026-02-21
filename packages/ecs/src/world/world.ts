import { Changes, ComponentType, Entity, EntityManager } from '../entity';
import { MapStorage, Storage } from '../storage';
import { LazyBuilder } from './lazy-builder';
import { EntityBuilder } from './entity-builder';
import { World as Base } from './types';
import { QueryBuilder, QueryManager } from '../query';
import { Presets } from './preset';
import { ComponentList } from './component-list';


/** @inheritDoc*/
export class World implements Base {

  /** @see Changes */
  public readonly changes = new Changes();

  /** @see EntityManager */
  public readonly entities = new EntityManager(this.changes);

  /** @see Presets */
  public readonly presets = new Presets();

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
   * Queries entities that match a specific {@link Composition}.
   *
   * ```ts
   *  const query = world.query().contains(Foo).build();
   *
   *  // Contains all entities that have the Foo component.
   *  console.log(query.entities);
   * ```
   *
   * Queries update their result on each world {@link update}. Consequently, it only
   * remains valid on the same update where it was read.
   *
   * Multiple queries that match the same composition are re-used internally.
   *
   * ```ts
   *  // Both calls return the same query instance.
   *  const entities1 = world.query().contains(Foo).build();
   *  const entities2 = world.query().contains(Foo).build();
   * ```
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
      // All entities we're iterating here are in a perpetual "may be alive" state and
      // therefore count as alive. We need to make sure we really only destroy living
      // entities or otherwise, this can free a previously freed entity index, which
      // may cause the entity manager to allocate broken entities in the future.
      if (! this.entities.isFree(entity)) {
        this.destroy(entity);
      }
    }

    return this;
  }

  /** Returns a `Set` that contains all registered component types. */
  public components(): Set<ComponentType> {
    return new Set([
      ...this.storages.keys()
    ]);
  }

  /** Returns a {@link ComponentList} that contains all components of an entity. */
  public list(entity: Entity): ComponentList {
    const list = new ComponentList();

    for (const type of this.storages.keys()) {
      const store = this.storage(type);

      if (store.has(entity)) {
        list.add(store.get(entity) as object);
      }
    }

    return list;
  }

}
