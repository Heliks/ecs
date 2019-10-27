import { Archetype } from './archetype';
import { BitSet } from './bit-set';
import { EntityManager } from './entity-manager';
import { EntityPool } from './entity-pool';
import { Filter } from './filter';
import { Storage } from './storage';
import { ClassType, Entity, Query, World as Base } from './types';

export class World implements Base {

    public readonly entities = new EntityManager();

    protected storages = new Map<ClassType, Storage>();

    protected storageIndex = 0;

    /** {@inheritDoc Base.register()} */
    public register<T>(component: ClassType<T>): Storage<T> {
        const storage = new Storage<T>(1 << this.storageIndex++, component, this.entities);

        this.storages.set(component, storage);

        return storage;
    }

    /** {@inheritDoc Base.storage()} */
    public storage<T>(component: ClassType<T>): Storage<T> {
        const storage = this.storages.get(component) as Storage<T>;

        return storage
            ? storage
            : this.register(component);
    }

    public createComposition(components: ClassType[]): BitSet {
        const bits = new BitSet();

        for (const component of components) {
            bits.add(this.storage(component).id);
        }

        return bits;
    }

    public createFilter(query: Query): Filter {
        return new Filter(
            this.createComposition(query.contains || []),
            this.createComposition(query.excludes || [])
        );
    }

    /** {@inheritDoc Base.create()} */
    public create(components?: ClassType[]): Entity {
        const entity = Symbol();

        if (components) {
            for (const component of components) {
                this.storage(component).add(entity);
            }
        }

        return entity;
    }

    /** {@inheritDoc Base.archetype()} */
    public archetype(): Archetype {
        return new Archetype(this);
    }

    /** {@inheritDoc Base.insertEntity()} */
    public insert(entity: Entity, dirty = true): void {
        this.entities.insert(entity);

        if (dirty) {
            this.entities.setDirty(entity);
        }
    }

    public update(): void {
        this.entities.sync();
    }

    public pool(query: Query) {
        return this.entities.registerPool(this.createFilter(query));
    }

    public findPools(query: Query | Filter): EntityPool[] {
        return this.entities.findPools(
            query instanceof Filter ? query : this.createFilter(query)
        );
    }

}

