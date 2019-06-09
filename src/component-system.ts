import BaseSystem from './base-system';
import Bootable from './bootable';
import ComponentMapper from './component-mapper';
import EntityManager from './entity-manager';
import { ComponentType } from './types';

export default abstract class ComponentSystem<T = any> extends BaseSystem implements Bootable {

    /** Mapper that belongs to the targeted ``ComponentType`` of this system */
    protected componentMapper?: ComponentMapper<T>;

    /**
     * @param componentType  The component type over which we want to iterate
     */
    protected constructor(protected componentType: ComponentType<T>) {
        super();
    }

    /**
     * Called for each available instance of our component type
     *
     * @param component
     */
    abstract process(component: T): void;

    /**
     * @param entityManager
     */
    boot(entityManager: EntityManager): void {
        this.componentMapper = entityManager.componentManager.mapper(this.componentType);
    }

    /**
     * Iterates over all component instances of our component type and calls ``process()``
     * for each one.
     */
    run(): void {
        if (this.componentMapper) {
            // todo: should probably be benchmarked if it would be faster to cast the component
            // map to an array before iteration to avoid the forEach() performance loss.
            this.componentMapper.components.forEach(item => this.process(item));
        }
    }

}

