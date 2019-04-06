import { ComponentType, Entity } from "./types";

export default class ComponentMapper<T> {

    /**
     * Contains all instances of the mapped component, mapped to the entity to
     * which the component belongs
     */
    public readonly instances = new Map<Entity, T>();

    /**
     * @param id Id of the mapper. Will usually be set by the component manager that has created this mapper.
     *        This will later be used as the value that is added to an entities composition.
     * @param component The type of component that for which this mapper is responsible
     */
    constructor(
        readonly id: number,
        protected component: ComponentType<T>
    ) {}

    /**
     * Creates a new instance of the mapped component type and assigns it to an entity.
     *
     * @param entity Entity to which the component belongs
     * @param params Constructor parameters used to instantiate the component instance
     * @returns Instance of the component that we just created
     */
    create(entity: Entity, ...params: any[]): T {
        const component = new this.component(...params);

        this.instances.set(entity, component);

        return component;
    }

    /**
     * Returns the instance of the mapped component for an entity.
     *
     * @param entity Entity to which the component belongs
     * @returns Instance of the component that belongs to the given entity
     */
    get(entity: Entity): T {
        const instance = this.instances.get(entity);

        if (! instance) {
            throw new Error(
                `Entity ${entity.toString()} does not have a ${this.component.toString()} component`
            );
        }

        return instance;
    }

    /**
     * Removes the component instance of an entity.
     *
     * @param entity Entity to which the component belongs
     */
    remove(entity: Entity): void {
        this.instances.delete(entity);
    }

    /**
     * Returns ``true`` if a component instance exists for an entity.
     *
     * @param entity Entity to which the component belongs
     * @returns Boolean indicating if the entity has a component or not
     */
    has(entity: Entity): boolean {
        return this.instances.has(entity);
    }

}