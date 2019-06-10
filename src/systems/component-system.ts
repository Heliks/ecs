import ComponentMapper from '../component-mapper';
import EntityManager from '../entity-manager';
import { ComponentType } from '../types';
import BaseSystem from './base-system';

export default abstract class ComponentSystem<T> extends BaseSystem {

    /**
     * The component mapper for this systems component type. Is set after the
     * system was booted.
     */
    protected componentMapper?: ComponentMapper<T>;

    /**
     * Returns the component type over which this system should iterate.
     *
     * @returns A component type.
     */
    abstract getComponentType(): ComponentType<T>;

    /**
     * Called for each registered instance of the component type over which this
     * system iterates.
     *
     * @param component The currently processed component instance.
     * @param deltaTime Delta time.
     */
    protected abstract process(component: T, deltaTime: number): void;

    /** {@inheritDoc BaseSystem.boot()} */
    boot(entityManager: EntityManager): void {
        this.componentMapper = entityManager
            .componentManager
            .mapper(this.getComponentType());
    }

    /** {@inheritDoc BaseSystem.run()} */
    run(deltaTime: number): void {
        if (this.componentMapper) {
            for (const instance of this.componentMapper.components.values()) {
                this.process(instance, deltaTime)
            }
        }
    }

}