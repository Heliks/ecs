import { ComponentType, EntityQuery, HasEntityQuery, } from './types';

export function hasEntityQuery(target: any): target is HasEntityQuery {
    return !! target.ecsEntityQuery;
}

export function contains(...types: ComponentType[]): EntityQuery {
    return {
        contains: types
    };
}