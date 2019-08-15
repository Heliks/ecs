import { ComponentMapperInjections, EntityQuery } from "./types";

export const COMPONENT_MAPPER_METADATA_KEY = Symbol();
export const ENTITY_QUERY_METADATA_KEY = Symbol();

export function getEntityQueryMetadata(target: object): EntityQuery {
    return Reflect.getMetadata(ENTITY_QUERY_METADATA_KEY, target) || {};
}

export function setEntityQueryMetadata(target: object, data: EntityQuery): void {
    Reflect.defineMetadata(ENTITY_QUERY_METADATA_KEY, data, target);
}

export function getComponentMapperMetadata(target: object): ComponentMapperInjections[] {
    return Reflect.getMetadata(COMPONENT_MAPPER_METADATA_KEY, target) || [];
}

export function setComponentMapperMetadata(target: object, data: ComponentMapperInjections[]): void {
    Reflect.defineMetadata(COMPONENT_MAPPER_METADATA_KEY, data, target);
}
