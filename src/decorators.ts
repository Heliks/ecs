import { ComponentType, EntityQuery } from './types';
import {
    getComponentMapperMetadata,
    getEntityQueryMetadata,
    setComponentMapperMetadata,
    setEntityQueryMetadata
} from './utils';

/**
 * Decorator to inject a component mapper into a class property.
 *
 * ```typescript
 * class FooSystem extends BaseSystem {
 *      @mapper(TransformComponent)
 *      public transform!: ComponentMapper<TransformComponent>:
 * }
 * ```
 *
 * As the component mapper for the transform component will only be injected
 * after the system was added to the world the exclamation mark after the
 * property is necessary to silence typescript errors in strict mode.
 *
 * @param type The type of component that the injected mapper should map.
 * @returns A property decorator.
 */
export function mapper(type: ComponentType): PropertyDecorator {
    return function _injectComponentMapper(target: object, key: string | symbol): void {
        const meta = getComponentMapperMetadata(target);

        meta.push({
            key,
            type
        });

        setComponentMapperMetadata(target, meta);
    };
}

/**
 * Decorator to apply entity query metadata to a class type.
 *
 * @param data Entity query.
 * @returns A class decorator
 */
export function query(data: EntityQuery): ClassDecorator {
    return (target: object) => setEntityQueryMetadata(target, data);
}

/**
 * Decorator to apply the ``contains`` part to the entity query metadata of a class type.
 *
 * @param components An array of components that will be used as the ``contains`` part
 *  of an entity query.
 * @returns A class decorator.
 */
export function contains(...components: ComponentType[]): ClassDecorator {
    return (target: object) => {
        const meta = getEntityQueryMetadata(target);

        meta.contains = components;

        setEntityQueryMetadata(target, meta);
    };
}

/**
 * Decorator to apply the ``excludes`` part to the entity query metadata of a class type.
 *
 * @param components An array of components that will be used as the ``excludes`` part
 *  of an entity query.
 * @returns A class decorator.
 */
export function excludes(...components: ComponentType[]): ClassDecorator {
    return (target: object) => {
        const meta = getEntityQueryMetadata(target);

        meta.excludes = components;

        setEntityQueryMetadata(target, meta);
    };
}
