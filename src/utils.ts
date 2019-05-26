import { HasEntityQuery, OnBoot, } from './types';

export function hasEntityQuery(target: any): target is HasEntityQuery {
    return !! target.ecsEntityQuery;
}

export function hasOnBootEvent(target: any): target is OnBoot {
    return typeof target.onBoot === 'function';
}