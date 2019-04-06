export type ComponentType<T> = new (...params: any[]) => T;
export type Entity = symbol;

export interface EntityQuery {
    contains?: ComponentType<any>[];
    excludes?: ComponentType<any>[];
}

export interface HasEntityListeners {
    onAddEntity(entity: Entity): void;
    onRemoveEntity(entity: Entity): void;
}

export interface HasEntityQuery {
    $$query: EntityQuery;
}
