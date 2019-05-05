import { HasEntityQuery, } from './types';

export function hasEntityQuery(target: any): target is HasEntityQuery {
    return !! target.$$query;
}
