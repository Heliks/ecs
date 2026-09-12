import { TypeData } from './types';


/**
 * Component that stores serialized component data whose type is unknown to the 
 * serializer.
 *
 * Opaque data is preserved when an entity is deserialized that has {@link TypeData}
 * that does not match any known {@link TypeId}. Because the serializer cannot create
 * the original component instance, the raw data is kept here instead.
 *
 * During serialization, opaque data is emitted back into the {@link EntityData} as
 * ordinary {@link TypeData}.
 */
export class Opaque {

  constructor(public readonly data: TypeData[]) {}

}
