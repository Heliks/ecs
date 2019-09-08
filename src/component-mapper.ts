import { ClassType, Entity, ReadonlyComponentMapper } from './types';

export class ComponentMapper<T = unknown> implements ReadonlyComponentMapper<T> {

    /**
     * Contains all instances of the mapped component, mapped to the entity to
     * which the component belongs
     */
    public readonly components = new Map<Entity, T>();

    /**
     * @param component The type of component that for which this mapper is responsible
     * @param id The mappers Id. Will be set by the component manager to create entity compositions.
     */
    constructor(
        public readonly component: ClassType<T>,
        public readonly id = -1
    ) {}

    /**
     * Creates a new instance of the mapped component type and assigns it to an entity.
     *
     * @param entity An Entity
     * @param data (optional) Data that should be set on the newly created instance.
     * @returns Instance of the component that we just created
     */
    public create(entity: Entity, data: Partial<T> = {}): T {
        // eslint-disable-next-line new-cap
        const component = new this.component();

        Object.assign(component, data);

        this.components.set(entity, component);

        return component;
    }

    /**
     * Calls {@link create()} internally, but returns the class context instead
     * of the created component.
     *
     * @param entity An entity
     * @param data (optional) Data that should be set on the newly created instance.
     * @returns this
     */
    public add(entity: Entity, data: Partial<T> = {}): this {
        this.create(entity, data);

        return this;
    }

    /** {@inheritDoc ReadonlyComponentMapper.get()} */
    public get(entity: Entity): T {
        const instance = this.components.get(entity);

        if (! instance) {
            throw new Error(`Entity ${entity.toString()} does not have a ${this.component.toString()} component`);
        }

        return instance;
    }

    /**
     * Removes the component instance of an entity.
     *
     * @param entity An Entity
     * @returns this
     */
    public remove(entity: Entity): this {
        this.components.delete(entity);

        return this;
    }

    /** {@inheritDoc ReadonlyComponentMapper.has()} */
    public has(entity: Entity): boolean {
        return this.components.has(entity);
    }

}
