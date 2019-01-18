import { ComponentType, Entity } from "./types";

export default class ComponentMapper<T> {

    /**
     * Contains all instances of the mapped component assigned to an entity
     *
     * @type {Map<Entity, T>}
     */
    protected instances = new Map<Entity, T>();

    /**
     * @param {id} id
     * @param {ComponentType<T>} component  Component type
     */
    constructor(
        readonly id: number,
        protected component: ComponentType<T>
    ) {}

    /**
     * Creates a new instance of the mapped component type and assigns it to an entity.
     *
     * @param {Entity} entity
     * @param params
     * @returns {T}
     */
    create(entity: Entity, ...params: any[]): T {
        const component = new this.component(...params);

        this.instances.set(entity, component);

        return component;
    }

    /**
     * Returns the instance of the mapped component for an entity.
     *
     * @param {Entity} entity
     * @returns {T}
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
     * @param {Entity} entity
     */
    remove(entity: Entity): void {
        this.instances.delete(entity);
    }

    /**
     * Returns true if a component instance exists for an entity.
     *
     * @param {Entity} entity
     * @returns {boolean}
     */
    has(entity: Entity): boolean {
        return this.instances.has(entity);
    }

}