import BaseSystem from "./base-system";
import Bootable from "./bootable";
import ComponentManager from './component-manager';
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
    public readonly entityManager = new EntityManager();

    /** {@see ComponentManager} */
    public readonly componentManager: ComponentManager;

    /** Collection of all registered systems */
    protected systems: BaseSystem[] = [];

    /***/
    constructor() {
        this.componentManager = this.entityManager.componentManager;
    }



    /** {@link EntityManager.create()} */
    create(components: ComponentType[] = []): Entity {
        return this.entityManager.create(components);
    }

    /** {@link ComponentManager.mapper()} */
    getMapper<T>(type: ComponentType<T>): ComponentMapper<T> {
        return this.componentManager.mapper(type);
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
     * Handles all relevant updates on sub-systems. Should be called on every frame.
     *
     * @param delta Delta time since the last frame
     */
    update(delta: number = 0): void {
        this.entityManager.synchronize();

        for (const system of this.systems) {
            system.update(delta);
        }
    }

}
