import { ComponentType, Entity } from './types';

export default class ComponentMapper<T> {

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

    /**
     * Creates a new instance of the mapped component type and assigns it to an entity.
     *
     * @param entity An Entity
     * @param data (optional) Data that should be set on the newly created instance.
     * @returns Instance of the component that we just created
     */
    create(entity: Entity, data: Partial<T> = {}): T {
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
    add(entity: Entity, data: Partial<T> = {}): this {
        this.create(entity, data);

        return this;
    }

    /**
     * Returns the instance of the mapped component for an entity.
     *
     * @param entity Entity to which the component belongs
     * @returns Instance of the component that belongs to the given entity
     */
    get(entity: Entity): T {
        const instance = this.components.get(entity);

        if (! instance) {
            throw new Error(
                `Entity ${entity.toString()} does not have a 
                ${this.component.toString()} component`
            );
        }

        return instance;
    }

    /**
     * Removes the component instance of an entity.
     *
     * @param entity An Entity
     * @returns this
     */
    remove(entity: Entity): this {
        this.components.delete(entity);

        return this;
    }

    /**
     * Returns ``true`` if a component instance exists for an entity.
     *
     * @param entity An Entity
     * @returns Boolean indicating if the entity has a component or not
     */
    has(entity: Entity): boolean {
        return this.components.has(entity);
    }

}
