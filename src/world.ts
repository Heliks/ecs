import { BitSet } from './bit-set';
import { Archetype } from './archetype';
import { EntityManager } from './entity-manager';
import { Filter } from './filter';
import { Storage } from './storage';
import { ClassType, Entity, EntityQuery, World as Base } from './types';

export class World implements Base {

    public readonly entities = new EntityManager();

    protected storages = new Map<ClassType, Storage>();

    /** {@inheritDoc Base.register()} */
    public register<T>(component: ClassType<T>): Storage<T> {
        const storage = new Storage<T>(this.storages.size + 1, component, this.entities);

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

    public createFilter(query: EntityQuery): Filter {
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

        this.entities.insert(entity);

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

}
