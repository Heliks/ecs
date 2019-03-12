import BaseSystem from "./base-system";
import Bootable from "./bootable";
import ComponentMapper from "./component-mapper";
import EntityManager from "./entity-manager";
import { ComponentType, Entity } from "./types";

/**
 * Returns true if the target is ``Bootable``
 *
 * @param target
 */
export function isBootable(target: any): target is Bootable {
    return typeof target.boot === 'function';
}

export default class World {

    /** {@see EntityManager} */
    readonly entityManager = new EntityManager();

    /** Collection of all registered systems */
    protected systems: BaseSystem[] = [];

    /** {@see EntityManager.create} */
    create(description: string = 'entity'): Entity {
        return this.entityManager.create(description);
    }

    /** {@see EntityManager.addComponent} */
    addComponent<T>(entity: Entity, type: ComponentType<T>, ...params: any[]): T {
        return this.entityManager.componentManager.addComponent(entity, type, ...params);
    }

    /** {@see EntityManager.getComponent} */
    getComponent<T>(entity: Entity, type: ComponentType<T>): T {
        return this.entityManager.componentManager.getComponent(entity, type);
    }

    /** {@see EntityManager.removeComponent} */
    removeComponent(entity: Entity, type: ComponentType<any>): void {
        this.entityManager.componentManager.removeComponent(entity, type);
    }

    /** {@see EntityManager.mapper} */
    getMapper<T>(type: ComponentType<T>): ComponentMapper<T> {
        return this.entityManager.componentManager.mapper(type);
    }

    /**
     * Adds a new system. If the system is bootable it will also be booted.
     *
     * @param system
     */
    addSystem(system: BaseSystem): void {
        this.systems.push(system);

        if (isBootable(system)) {
            system.boot(this.entityManager);
        }
    }

    /**
     * Returns the initialized instance of the given system type.
     *
     * @param type
     */
    getSystem<T extends BaseSystem>(type: new (...params: any[]) => T): T {
        const system = this.systems.find(item => item instanceof type);

        if (! system) {
            throw new Error(`System of type "${type.name}" does not exist.`);
        }

        return <T>system;
    }

    /** Clears all data */
    clear(): void {
        for (const system of this.systems) {
            if (system.clear) {
                system.clear();
            }
        }

        this.entityManager.clear();
    }

    /**
     * Handles all relevant updates. Should be called once every frame.
     *
     * @param delta
     */
    update(delta: number): void {
        this.entityManager.update();

        for (const system of this.systems) {
            system.update(delta);
        }
    }

}
