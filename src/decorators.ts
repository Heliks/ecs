import { EntityQuery } from './types';

/**
 * Decorates a class with an entity query.
 *
 * @param query An entity query
 * @returns constructor
 */
export function EntityQuery(query: EntityQuery): ClassDecorator {
    return (target: any): any => {
        target.$$query = query;

        return target;
    };
}