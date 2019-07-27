import { COMPONENT_MAPPER_INJECTION_METADATA } from './const';
import BaseSystem from './systems/base-system';
import { ComponentType } from './types';

/**
 * Injects a component mapper for the given component type on a {@link BaseSystem}
 * when the system is booted.
 *
 * @param type A component type.
 * @returns A property decorator.
 */
export function injectMapper(type: ComponentType): Function {
    return function _injectComponentMapper<T extends BaseSystem>(target: T, key: string | symbol): void {
        const injections = Reflect.getMetadata(COMPONENT_MAPPER_INJECTION_METADATA, target) || [];

        injections.push({ key, type });

        Reflect.defineMetadata(
            COMPONENT_MAPPER_INJECTION_METADATA,
            injections,
            target
        );
    };
}
