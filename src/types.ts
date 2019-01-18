export type ComponentType<T> = new (...params: any[]) => T;
export type Entity = symbol;

export interface EntityQuery {
    contains?: ComponentType<any>[];
    excludes?: ComponentType<any>[];
}

