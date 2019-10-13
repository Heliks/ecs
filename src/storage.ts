import { EntityManager } from './entity-manager';
import { ClassType, Entity, Storage as Base } from './types';

export class Storage<T = unknown> implements Base<T> {

    /** Contains all component instances mapped to the entity to which they belong. */
    protected components = new Map<Entity, T>();

    /**
     * @param id The id of the storage.
     * @param type The component type that this storage is storing.
     * @param entityMgr Entity manager.
     */
    constructor(
        public readonly id: number,
        public readonly type: ClassType<T>,
        protected readonly entityMgr: EntityManager
    ) {}

    /** {@inheritDoc Base.add()} */
    public add(entity: Entity, data?: Partial<T>): T {
        // eslint-disable-next-line new-cap
        const component = new this.type();

        if (data) {
            Object.assign(component, data);
        }

        this.components.set(entity, component);

        this.entityMgr.composition(entity).add(this.id);
        this.entityMgr.setDirty(entity);

        return component;
    }

    /** {@inheritDoc Base.set()} */
    public set(entity: Entity, instance: T): void {
        this.components.set(entity, instance);

        this.entityMgr.composition(entity).add(this.id);
        this.entityMgr.setDirty(entity);
    }

    /** {@inheritDoc Base.get()} */
    public get(entity: Entity): T {
        const component = this.components.get(entity) as T;

        if (! component) {
            throw new Error('No component found for entity.');
        }

        return component;
    }

    /** {@inheritDoc Base.remove()} */
    public remove(entity: Entity): boolean {
        if (this.components.has(entity)) {
            this.components.delete(entity);

            this.entityMgr.composition(entity).remove(this.id);
            this.entityMgr.setDirty(entity);

            return true;
        }

        return false;
    }

    /** {@inheritDoc Base.has()} */
    public has(entity: Entity): boolean {
        return this.components.has(entity);
    }

    /**
     * Drops the complete storage. All entities that stored a component
     * here will be marked as "dirty" and their composition updated
     * accordingly.
     */
    public drop(): void {
        for (const entity of this.components.keys()) {
            this.entityMgr.composition(entity).remove(this.id);
            this.entityMgr.setDirty(entity);
        }

        this.components.clear();
    }

}
