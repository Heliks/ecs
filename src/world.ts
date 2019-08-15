import { EntityManager } from './entity-manager';
import { ComponentManager } from './component-manager';
import { BaseSystem } from './systems';
import { getComponentMapperMetadata } from './utils';
import { ClassType, ComponentType, Entity } from './types';
import { ComponentMapper } from './component-mapper';

export class World {

    /** {@see EntityManager} */
    readonly entityManager = new EntityManager();

    /** {@see ComponentManager} */
    readonly componentManager: ComponentManager;

    /** Contains all systems that belong to this world. */
    protected systems: BaseSystem[] = [];

    /** */
    constructor() {
        this.componentManager = this.entityManager.componentManager;
    }

    /**
     * Adds a system to the world. Systems are executed during the update phase.
     *
     * @param system A system.
     * @returns this
     */
    addSystem<T extends BaseSystem>(system: T): this {
        // Handle injections of component mappers.
        const injections = getComponentMapperMetadata(system);

        if (injections) {
            // Todo: should avoid the 'any' hack if possible.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const target = system as any;

            for (const injection of injections) {
                target[ injection.key ] = this.getMapper(injection.type);
            }
        }

        system.boot(this.entityManager);

        this.systems.push(system);

        return this;
    }

    /**
     * Returns a system that matches the given class type.
     *
     * @param type A system constructor type.
     * @returns A system
     */
    getSystemFromType<T extends BaseSystem>(type: ClassType<T>): T {
        const instance = this.systems.find(item => item.constructor === type);

        if (! instance) {
            throw new Error(`Cannot find system '${type.constructor.name}'`);
        }

        return instance as T;
    }

    /**
     * Handles all relevant updates on sub-systems. Should be called on every frame.
     *
     * @param deltaTime Delta time.
     */
    update(deltaTime = 0): void {
        this.entityManager.synchronize();

        for (const system of this.systems) {
            system.update(deltaTime);
        }
    }

    /** {@link EntityManager.create()} */
    create(components: ComponentType[] = []): Entity {
        return this.entityManager.create(components);
    }

    /** {@link ComponentManager.addComponent()} */
    addComponent<T extends object>(
        entity: Entity,
        type: ComponentType<T>,
        data: Partial<T> = {}
    ): this {
        this.componentManager.add(entity, type, data);

        return this;
    }

    /** {@link ComponentManager.addMany()} */
    addComponents(entity: Entity, types: ComponentType[]): this {
        this.componentManager.addMany(entity, types);

        return this;
    }

    /** {@link ComponentManager.mapper()} */
    getMapper<T extends object>(type: ComponentType<T>): ComponentMapper<T> {
        return this.componentManager.mapper(type);
    }

    /** Clears all data */
    clear(): void {
        this.entityManager.clear();
    }

}
