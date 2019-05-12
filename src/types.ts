export type ComponentType<T> = new (...params: any[]) => T;
export type Entity = symbol;

export interface EntityQuery {
    contains?: ComponentType<any>[];
    excludes?: ComponentType<any>[];
}

export interface HasEntityQuery {
    $$query: EntityQuery;
}

export const ENTITY_EVENT_ADD = Symbol();
export const ENTITY_EVENT_REMOVE = Symbol();
export const ENTITY_EVENT_CLEAR = Symbol();

/** Lifecycle event for {@see Bootable} systems */
export interface OnBoot {

    /** Called after the event was booted. */
    onBoot(): void;

}
