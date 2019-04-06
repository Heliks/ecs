import { HasEntityQuery } from './types';

/**
 * TypeGuard that checks if the given target has an entity query
 *
 * @param target The target to check
 * @returns Boolean indicating if the target has an entity query
 */
export function hasEntityQuery(target: any): target is HasEntityQuery {
    return !! target.$$query;
}