import * as bitsetConstructor from 'bitset/bitset';

/**
 *
 * This is a workaround for bundling BitSet.js with webpack without getting
 * any import errors as the BitSet.d appears to be not working correctly.
 * (webpack transpiles ``new BitSet()`` to new ``bitset_1.BitSet()``
 * when ``bitset_1`` itself already contains the constructor).
 *
 * todo: remove this when fixed or a better workaround is found
 *
 * @see BitSet
 */
export interface Bitset {
  new (input?: string | number | Bitset | Array<number> | Uint8Array): Bitset;
  and(bitset: Bitset): Bitset;
  clear(from?: number, to?: number): Bitset;
  equals(bitset: Bitset): boolean;
  get(index: number): 0 | 1;
  isEmpty(): boolean;
  set(index: number): Bitset;
}

// we prefix this so it's obvious in the code that this is not the "right" way forward
export const _BITSET = <Bitset><any>bitsetConstructor;
