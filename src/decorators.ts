import EntitySystem from './entity-system';
import { ClassType, ComponentArray, HasEntityQuery } from './types';

/**
 * Assigns a static entity query to an entity system.
 *
 * @param contains (optional) The set of components that all entities must contain.
 * @param excludes (optional) The set of components that all entities must not contain.
 * @returns A class decorator
 */
export function assignEntityQueryDecorator(contains: ComponentArray = [], excludes: ComponentArray = []) {
    return <T extends EntitySystem>(target: ClassType<T> & Partial<HasEntityQuery>) => {
        target.ecsEntityQuery = {
            contains,
            excludes
        };

        return target;
    }
}