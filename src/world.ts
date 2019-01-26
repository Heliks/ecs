import BaseSystem from "./base-system";
import Bootable from "./bootable";
import ComponentMapper from "./component-mapper";
import EntityManager from "./entity-manager";
import { ComponentType, Entity } from "./types";

/**
 * Returns true if the target is a bootable system
 *
 * @param target
 * @returns {boolean}
 */
export function isBootable(target: any): target is Bootable {
    return typeof target.boot === 'function';
}

export default class World {

    /**
     * @type {EntityManager}
     */
    readonly entityManager = new EntityManager();

    /**
     * @type {BaseSystem[]}
     */
    protected systems: BaseSystem[] = [];

    /**
     * @see EntityManager.create
     * @param {string} description
     * @returns {Entity}
     */
    create(description: string = 'entity'): Entity {
        return this.entityManager.create(description);
    }

    /**
     * @see ComponentManager.addComponent
     * @param {Entity} entity
     * @param {ComponentType<T>} type
     * @param {any[]} params
     * @returns {T}
     */
    addComponent<T>(entity: Entity, type: ComponentType<T>, ...params: any[]): T {
        return this.entityManager.componentManager.addComponent(entity, type, ...params);
    }

    /**
     * @see ComponentManager.getComponent
     * @param {Entity} entity
     * @param {ComponentType<T>} type
     * @returns {T}
     */
    getComponent<T>(entity: Entity, type: ComponentType<T>): T {
        return this.entityManager.componentManager.getComponent(entity, type);
    }

    /**
     * @see ComponentManager.removeComponent
     * @param {Entity} entity
     * @param {ComponentType<any>} type
     */
    removeComponent(entity: Entity, type: ComponentType<any>): void {
        this.entityManager.componentManager.removeComponent(entity, type);
    }

    /**
     * @see {ComponentManager.mapper}
     * @param {ComponentType<T>} type
     * @returns {ComponentMapper<T>}
     */
    getMapper<T>(type: ComponentType<T>): ComponentMapper<T> {
        return this.entityManager.componentManager.mapper(type);
    }

    /**
     * Adds a new system. If the system is bootable it will also be booted.
     *
     * @param {BaseSystem} system
     */
    addSystem(system: BaseSystem): void {
        this.systems.push(system);

        if (isBootable(system)) {
            system.boot(this.entityManager);
        }
    }

    /**
     * @param {{new(...params: any[]): T}} type
     * @returns {T}
     */
    getSystem<T extends BaseSystem>(type: new (...params: any[]) => T): T {
        const system = this.systems.find(item => item instanceof type);

        if (! system) {
            throw new Error(`System of type "${type.name}" does not exist.`);
        }
        
        return <T>system;
    }

    /**
     * Handles all relevant updates. Should be called once every frame.
     *
     * @param {number} delta
     */
    update(delta: number): void {
        this.entityManager.update();

        for (const system of this.systems) {
            system.update(delta, this.entityManager);
        }
    }

}