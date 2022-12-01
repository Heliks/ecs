const BITS_PER_NUMBER = 32;


/** @internal */
function getVec(index: number): number {
  return Math.floor(index / BITS_PER_NUMBER);
}

/** @internal */
function getBit(index: number): number {
  return (1 << (index % BITS_PER_NUMBER));
}

/**
 * Data structure that uses bits to check if a certain value is in a set.
 *
 * The advantage of bit vectors is that they are pretty fast since they basically just
 * do a little bitwise math. They are also very memory efficient and cache friendly. The
 * main benefit however is that they can have any arbitrary size while normal bitsets
 * are limited to a total of 32 bits.
 */
export class BitSet {

  /**
   * Stores the individual `Number` bit-masks that make-up the bit-vector. Since we need
   * one `Number` type per 32 bits, the length of this array is equal to `bits / 32`.
   */
  public readonly values: Uint32Array;

  /**
   * @param size Total amount of bits that can be stored in this vector.
   */
  constructor(public readonly size: number) {
    this.values = new Uint32Array(Math.ceil(size / BITS_PER_NUMBER));
  }

  /**
   * Creates a bit-vector from an array of already set bits.
   *
   * ```ts
   * const vec = BitVec.fromArray(32, [0, 1, 5]);
   *
   * console.log(vec.has(0)); // true
   * console.log(vec.has(1)); // true
   * console.log(vec.has(5)); // true
   * ```
   */
  public static fromArray(size: number, bits: number[]): BitSet {
    const vec = new BitSet(size);

    for (const bit of bits) {
      vec.set(bit);
    }

    return vec;
  }

  /** Sets a bit `index`. Returns `true` if the bit was sucessfully set. */
  public set(index: number): boolean {
    const v = getVec(index);
    const b = getBit(index);

    if ((this.values[ v ] & b) !== 0) {
      return false;
    }

    this.values[v] |= b;

    return true;
  }

  /** Removes the given bit `index`. Returns `true` if removal was successful. */
  public remove(index: number): boolean {
    const b = getBit(index);

    if (this.values[getVec(index)] & b) {
      this.values[getVec(index)] &= ~b;

      return true;
    }

    return false;
  }

  /** Returns `true` if a bit `index` is set. */
  public has(index: number): boolean {
    return (this.values[getVec(index)] & getBit(index)) !== 0;
  }

  /** Clears all bits that are set. */
  public clear(): this {
    for (let i = 0; i < this.values.length; i++) {
      this.values[i] = 0;
    }

    return this;
  }

  /** Returns `true` if this vector is equal to `vec`. */
  public equals(vec: BitSet): boolean {
    for (let i = 0; i < Math.max(this.values.length, vec.values.length); i++) {
      if (this.values[i] !== vec.values[i]) {
        return false;
      }
    }

    return true;
  }

  /** Returns `true` if this vector has every bit set that is set in `vec`. */
  public contains(vec: BitSet): boolean {
    for (let i = 0; i < Math.max(this.values.length, vec.values.length); i++) {
      if ((this.values[i] & vec.values[i]) !== vec.values[i]) {
        return false;
      }
    }

    return true;
  }

  /** Returns `true` if this vector does not have any bit set that is set in `vec`. */
  public excludes(vec: BitSet): boolean {
    for (let i = 0; i < Math.max(this.values.length, vec.values.length); i++) {
      if ((vec.values[i] & this.values[i]) !== 0) {
        return false;
      }
    }

    return true;
  }

}
