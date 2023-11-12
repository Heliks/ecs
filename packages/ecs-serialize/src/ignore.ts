import { Type } from './type-registry';


/** @internal */
const IGNORE_META_KEY = Symbol();

/** Returns `true` if a `property` of a `component` is ignored by serialization.  */
export function isIgnored<T extends object, K = keyof T>(component: T, property?: K): boolean {
  return Boolean(
    Reflect.getMetadata(IGNORE_META_KEY, component, property as string)
  );
}

/**
 * Marks a property as ignored. Ignored properties will be excluded when a type
 * is serialized.
 *
 * ```ts
 *  class Foo {
 *    // This property will not be serialized.
 *    @Ignore()
 *    foo = 1;
 *
 *    // This property will be serialized normally.
 *    bar = 2;
 *  }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function Ignore<C>(): Function {
  return function ignoreDecorator(target: Type<C>, key: string): void {
    Reflect.defineMetadata(IGNORE_META_KEY, true, target, key);
  }
}
