/**
 * An entity to which components can be attached.
 *
 * Entities are represented by a 32-bit integer (e.g. `number` type) that is split into
 * two segments: an index and a version. The index is the actual index that the entity
 * occupies in memory and the version is the generation in which the entity exists. If
 * an entity is destroyed and the index is recycled, the version is increased by one,
 * which leaves the previous entity that occupied that index as invalid.
 *
 * If we'd pretend that the entity is an 8-bit integer where we occupy 6 bits for the
 * index and 2 bits for the version, it would look like this:
 *
 * ```
 * Entity = 00100100
 *          001001[00] <-- steal two bits for version
 *          001001    00
 *            ^       ^
 *          index   version
 * ```
 *
 * This leave us with 001001 (9) as entity index and 00 (0) as entity version. For real
 * entities the index occupies 20 bits, which allows for a maximum of 1048575 entities
 * to exist in the same world at the same time.
 */
export type Entity = number;

// The amount of bits reserved on the 32 bit entity identifier to store the index
// position. By reserving 20 bits the maximum amount of entities that can be alive at the
// same time is limited to 1048575, which should be enough for most games.
export const ENTITY_BITS = 20;

// Mask used to extract the index part of an entity identifier.
export const ENTITY_MASK = 0xFFFFF;

/** Returns the ID of `entity`. The ID is simultaneously the index that it occupies. */
export function entityId(entity: Entity): number {
  return entity & ENTITY_MASK;
}

/** Returns the version of `entity`. */
export function entityVersion(entity: Entity): number {
  return entity >> ENTITY_BITS;
}
