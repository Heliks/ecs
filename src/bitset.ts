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
    /* eslint-disable-next-line */
    new (input?: string | number | Bitset | number[] | Uint8Array): Bitset;
    and(bitset: Bitset): Bitset;
    clear(from?: number, to?: number): Bitset;
    equals(bitset: Bitset): boolean;
    get(index: number): 0 | 1;
    isEmpty(): boolean;
    set(index: number): Bitset;
}

// We prefix this so it's obvious in the code that this is not the "right" way forward
// eslint-disable-next-line no-underscore-dangle
export const _BITSET = bitsetConstructor as unknown as Bitset;
