import { ComponentMapper as ComponentMapperInterface, ComponentType, Entity } from './types';

export default class ComponentMapper<T> implements ComponentMapperInterface<T> {

    /**
     * Contains all instances of the mapped component, mapped to the entity to
     * which the component belongs
     */
    readonly components = new Map<Entity, T>();

    /**
     * @param component The type of component that for which this mapper is responsible
     * @param id The mappers Id. Will be set by the component manager to create entity compositions.
     */
    constructor(
        public readonly component: ComponentType<T>,
        public readonly id = -1
    ) {}

    /** {@inheritDoc ComponentMapperInterface.create()} */
    create(entity: Entity, data: Partial<T> = {}): T {
        // eslint-disable-next-line new-cap
        const component = new this.component();

        Object.assign(component, data);

        this.components.set(entity, component);

        return component;
    }

    /** {@inheritDoc ComponentMapperInterface.add()} */
    add(entity: Entity, data: Partial<T> = {}): this {
        this.create(entity, data);

        return this;
    }

    /** {@inheritDoc ComponentMapperInterface.get()} */
    get(entity: Entity): T {
        const instance = this.components.get(entity);

        if (! instance) {
            throw new Error(
                `Entity ${entity.toString()} does not have a ${this.component.toString()} component`
            );
        }

        return instance;
    }

    /** {@inheritDoc ComponentMapperInterface.remove()} */
    remove(entity: Entity): this {
        this.components.delete(entity);

        return this;
    }

    /** {@inheritDoc ComponentMapperInterface.has()} */
    has(entity: Entity): boolean {
        return this.components.has(entity);
    }

}
