import { BitSet } from './bit-set';
import { EntityManager } from './entity-manager';
import { Filter } from './filter';
import { Storage } from './storage';
import { ClassType, Entity, EntityQuery } from './types';

export class World {

    public readonly entities = new EntityManager();

    protected storages = new Map<ClassType, Storage>();

    public register<T>(component: ClassType<T>): Storage<T> {
        const storage = new Storage<T>(this.storages.size + 1, component, this.entities);

        this.storages.set(component, storage);

        return storage;
    }

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

    public update(): void {
        this.entities.sync();
    }

}
