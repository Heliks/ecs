/**
 * An entity to which components can be attached.
 *
 * Entities are represented by a 32-bit integer (e.g. `number` type) that is split into
 * two segments: an index and a version. The index is the index that it occupies, the
 * version counts how many times it has been recycled.
 *
 * For example, using an 8-bit integer for simplicity, we occupy 6 bits for the index,
 * and 2 bits for the version:
 *
 * ```
 * Entity = 00100100
 *          001001[00] <-- steal two bits for version
 *          001001    00
 *            ^       ^
 *          index   version
 * ```
 *
 * For real entities, the index occupies 20 bits, which allows for a maximum of 1048575
 * entities to exist at the same time.
 *
 * The entity index simultaneously acts as the entities unique identifier.
 */
export type Entity = number;

/** Amount of bits reserved on the 32-bit entity to store its index. */
export const ENTITY_BITS = 20;

/** Mask used to extract the index part of an entity identifier. */
export const ENTITY_MASK = 0xFFFFF;

/** Returns the index part of the given `entity`. */
export function entityId(entity: Entity): number {
  return entity & ENTITY_MASK;
}

/** Returns the version of `entity`. */
export function entityVersion(entity: Entity): number {
  return entity >> ENTITY_BITS;
}
