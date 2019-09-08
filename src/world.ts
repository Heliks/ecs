import { ComponentMapper } from './component-mapper';
import { ClassType, EntityQuery, ReadonlyComponentMapper } from './types';
import { _BITSET, Bitset } from './bitset';
import { EntityPool } from './entity-pool';
import { Filter } from './filter';

export class World {

    /** Component mappers mapped to the class type of the component for which they are responsible. */
    protected componentMappers = new Map<ClassType, ComponentMapper>();

    /** Composition ids mapped to the entity to which they belong. */
    protected compositionIds = new Map<symbol, Bitset>();

    /** Time value from last world update to this. */
    protected deltaTime = 0;

    /** Entities that are currently spawned inside the world. */
    protected entities: symbol[] = [];

    /** Entities that had their composition updated and should be synchronized. */
    protected dirty: symbol[] = [];

    /** The id that is assigned to the next component mapper that is created. */
    protected nextComponentMapperId = 1;

    /** Entity pools. */
    protected pools: EntityPool[] = [];

    /**
     * Returns all entities.
     *
     * @returns All entities.
     */
    public getEntities(): readonly symbol[] {
        return this.entities;
    }

    /**
     * Returns an entity pool that contains all entities that satisfy the given
     * query. Pools are updated automatically and can be used to quickly iterate
     * over a set of entities.
     *
     * ```typescript
     * class Foo {}
     * class Bar {}
     *
     * const pool = world.pool({
     *     contains: [
     *         Foo,
     *         Bar
     *     ]
     * });
     *
     * // Iterate over all entities that have a "Foo" and "Bar" component.
     * for (const entity of pool.entities) {
     *     // Do something with entity.
     * }
     * ```
     *
     * @param query A entity query.
     * @returns An entity pool.
     */
    public pool(query: EntityQuery = {}): EntityPool {
        const filter = this.createFilter(query);

        // If a pool with the same filter already exist we use that one
        let pool = this.pools.find(pool => pool.filter.equals(filter));

        if (pool) {
            return pool;
        }

        pool = new EntityPool(filter);

        // Populate pool with eligible entities
        for (const entity of this.entities) {
            const compositionId = this.compositionId(entity);

            if (pool.test(compositionId)) {
                pool.add(entity);
            }
        }

        this.pools.push(pool);

        return pool;
    }

    /** Synchronizes registered pools with composition updates. */
    public synchronize(): void {
        const dirty = this.dirty;

        // Nothing to update.
        if (! dirty.length) {
            return;
        }

        for (const pool of this.pools) {
            for (const entity of dirty) {
                // Entity is contained in pool. Check if it is no longer eligible
                // and should be removed.
                if (pool.has(entity)) {
                    if (! pool.test(this.compositionId(entity))) {
                        pool.remove(entity);
                    }
                }

                // Entity is not contained. Check if it can be added to the pool.
                else if (pool.test(this.compositionId(entity))) {
                    pool.add(entity);
                }
            }
        }

        // Synchronized entities are no longer dirty.
        this.dirty.length = 0;
    }

    /**
     * Returns a mapper for the given component. The mapper will be created
     * automatically if none exists.
     *
     * @param component Mapper for this component
     * @returns A component mapper.
     */
    protected _mapper<T>(component: ClassType<T>): ComponentMapper<T> {
        let mapper = this.componentMappers.get(component);

        if (mapper) {
            return mapper as ComponentMapper<T>;
        }

        mapper = new ComponentMapper(
            component,
            this.nextComponentMapperId++
        );

        this.componentMappers.set(component, mapper);

        return mapper as ComponentMapper<T>;
    }

    /**
     * Returns a mapper for the given component that can be used to access
     * component instances. In high-performance scenarios it can be faster
     * to keep the mapper in memory and then use it directly.
     *
     * ```typescript
     * class Position {
     *      x = 0;
     *      y = 0;
     * }
     *
     * class Movement {
     *     moving = false;
     *     speed = 1;
     * }
     *
     * const world = new World();
     *
     * const entity = world.spawn();
     * const mapper = world.mapper(Position);
     *
     * world
     *      .add(entity, Position)
     *      .add(entity, Movement, {
     *          moving: true
     *      });
     *
     * function tick(deltaTime) {
     *      world.update();
     *
     *      const position = mapper.get(Position);
     *      const movement = mapper.get(Movement);
     *
     *      if (movement.moving) {
     *          position.x += movement.speed * deltaTime;
     *          position.y += movement.speed * deltaTime;
     *      }
     *
     *      window.requestAnimationFrame(tick);
     * }
     *
     * // Start the game loop.
     * tick();
     * ```
     *
     * @param component Mapper for this component.
     * @returns A component mapper.
     */
    public mapper<T>(component: ClassType<T>): ReadonlyComponentMapper<T> {
        return this._mapper(component);
    }

    /**
     * Flags an entity as dirty.
     *
     * @param entity The entity that should be flagged as dirty.
     */
    protected flagDirty(entity: symbol): void {
        if (this.dirty.indexOf(entity) === -1) {
            this.dirty.push(entity);
        }
    }

    /**
     * Creates a composition id from the given components.
     *
     * @param components Components from which the composition id should be created.
     * @returns A composition id.
     */
    public createCompositionId(components: ClassType[]): Bitset {
        const id = new _BITSET();

        for (const type of components) {
            id.set(this._mapper(type).id);
        }

        return id;
    }

    /**
     * Returns the composition id of the given entity.
     *
     * @param entity An entity.
     * @returns The entities composition id.
     */
    protected compositionId(entity: symbol): Bitset {
        let id = this.compositionIds.get(entity);

        if (id) {
            return id;
        }

        id = new _BITSET();

        this.compositionIds.set(entity, id);

        return id;
    }

    /**
     * Spawns an entity.
     *
     * @returns An entity symbol.
     */
    public spawn(): symbol {
        const entity = Symbol();

        this.entities.push(entity);

        return entity;
    }

    /**
     * De-spawns an entity.
     *
     * @param entity The entity that should be de-spawned.
     * @returns this
     */
    public despawn(entity: symbol): this {
        const index = this.entities.indexOf(entity);

        if (~index) {
            this.compositionId(entity).clear();

            // Remove entity from pool.
            for (const pool of this.pools) {
                if (pool.has(entity)) {
                    pool.remove(entity);
                }
            }

            this.entities.splice(index, 1);
        }

        return this;
    }

    /**
     * Returns a new filter from the given query.
     *
     * @param query The query from which the filter is created.
     * @returns A filter.
     */
    public createFilter(query: EntityQuery = {}): Filter {
        return new Filter(
            this.createCompositionId(query.contains || []),
            this.createCompositionId(query.excludes || [])
        );
    }

    /**
     * Adds a component to an entity.
     *
     * @param entity The entity to which the component should be added.
     * @param component A component.
     * @param data (optional) Data that is assigned to the component after
     *  it was created
     * @returns this
     */
    public add<T>(entity: symbol, component: ClassType<T>, data?: Partial<T>): this {
        const mapper = this._mapper(component).add(entity, data);

        this.compositionId(entity).set(mapper.id);
        this.flagDirty(entity);

        return this;
    }

    /**
     * Returns the instance of the given component that belongs to
     * the given entity.
     *
     * @param entity The entity to which the component belongs.
     * @param component The type of component
     * @returns A component instance.
     */
    public get<T>(entity: symbol, component: ClassType<T>): T {
        return this._mapper(component).get(entity);
    }

    /**
     * Checks if an entity has a component.
     *
     * @param entity An entity.
     * @param component The component that is tested.
     * @returns True if the entity has the given component.
     */
    public has(entity: symbol, component: ClassType): boolean {
        return this._mapper(component).has(entity);
    }

    /**
     * Removes a component from an entity.
     *
     * @param entity The entity from which the component should be removed.
     * @param component The component that should be removed from the entity.
     * @returns this
     */
    public remove(entity: symbol, component: ClassType): this {
        const mapper = this._mapper(component);

        if (mapper.has(entity)) {
            mapper.remove(entity);

            this.compositionId(entity).clear(mapper.id);
            this.flagDirty(entity);
        }

        return this;
    }

    /**
     * Updates the world. Should be called once on every frame.
     *
     * @param deltaTime Time value between last frame and this one.
     */
    public update(deltaTime: number): void {
        this.deltaTime = deltaTime;
        this.synchronize();
    }

}

