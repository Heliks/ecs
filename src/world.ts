import ComponentManager from './component-manager';
import ComponentMapper from './component-mapper';
import EntityManager from './entity-manager';
import { ComponentType, Entity } from './types';

export default class World {

    /** {@see EntityManager} */
    readonly entityManager = new EntityManager();

    /** {@see ComponentManager} */
    readonly componentManager: ComponentManager;

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

    /** Clears all data */
    clear(): void {
        this.entityManager.clear();
    }

    /**
     * Handles all relevant updates on sub-systems. Should be called on every frame.
     *
     * @param delta Delta time since the last frame
     */
    update(delta: number = 0): void {
        this.entityManager.synchronize();

        console.log(delta);
    }

}
