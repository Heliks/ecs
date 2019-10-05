import { EntityManager } from './entity-manager';
import { ClassType, Entity } from './types';

export class Storage<T = unknown> {

    protected components = new Map<Entity, T>();

    constructor(
        public readonly id: number,
        public readonly type: ClassType<T>,
        protected readonly entities: EntityManager
    ) {}

    public add(entity: Entity, data?: Partial<T>): T {
        // eslint-disable-next-line new-cap
        const component = new this.type();

        if (data) {
            Object.assign(component, data);
        }

        this.components.set(entity, component);

        this.entities.composition(entity).add(this.id);
        this.entities.setDirty(entity);

        return component;
    }

    public remove(entity: Entity): boolean {
        if (this.components.has(entity)) {
            this.components.delete(entity);

            this.entities.composition(entity).remove(this.id);
            this.entities.setDirty(entity);

            return true;
        }

        return false;
    }

    public has(entity: Entity): boolean {
        return this.components.has(entity);
    }

}
