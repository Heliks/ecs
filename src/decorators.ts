import { EntityQuery } from './types';

/**
 * Decorates a class with a static entity query that can be used for the entity
 * pool by sub-systems of {@see EntitySystem}.
 *
 * @param query An entity query
 * @returns constructor
 */
export function EntityPool(query: EntityQuery): ClassDecorator {
    return (target: any): any => {
        target.$$query = query;

        return target;
    };
}