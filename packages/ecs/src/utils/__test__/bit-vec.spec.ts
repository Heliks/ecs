import { BitVec } from '../bit-vec';

describe('BitSet', () => {
  let fixture: BitVec;

  beforeEach(() => {
    fixture = new BitVec(64);
  });

  it.each([
    [0, true],
    [1, false],
    [32, true],
    [33, false]
  ])('should set bit index %i', (index, expected) => {
    const vec = new BitVec(64);

    vec.set(1);
    vec.set(33);

    expect(vec.set(index)).toBe(expected);
    expect(vec.has(index)).toBeTruthy();
  });

  it.each([
    [0, true],
    [1, false],
    [32, true],
    [33, false]
  ])('should remove bit index %s', (index, expected) => {
    const vec = new BitVec(64);

    vec.set(0);
    vec.set(32);

    expect(vec.remove(index)).toBe(expected);
    expect(vec.has(index)).toBeFalsy();
  });

  it.each([
    {
      expected: true,
      vec1: [0, 1, 32, 33],
      vec2: [0, 32]
    },
    {
      expected: false,
      vec1: [0, 1, 32, 33],
      vec2: [0, 1, 32, 33, 34]
    },
    {
      expected: true,
      vec1: [0, 1, 32, 33],
      vec2: [0, 1, 32]
    }
  ])('should test if vec1 fully contains vec2', data => {
    const vec1 = new BitVec(64);
    const vec2 = new BitVec(64);

    for (const bit of data.vec1) {
      vec1.set(bit);
    }

    for (const bit of data.vec2) {
      vec2.set(bit);
    }

    const contains = vec1.contains(vec2);

    expect(contains).toBe(data.expected);
  });

  it.each([
    {
      expected: true,
      vec1: [0, 1, 32, 33],
      vec2: [0, 1, 32, 33]
    },
    {
      expected: false,
      vec1: [0, 1, 32, 33],
      vec2: [0, 1, 32, 33, 34]
    },
    {
      expected: false,
      vec1: [0, 1, 32, 33],
      vec2: [0, 1, 32]
    }
  ])('should test if two vectors are equal', data => {
    const vec1 = new BitVec(64);
    const vec2 = new BitVec(64);

    for (const bit of data.vec1) {
      vec1.set(bit);
    }

    for (const bit of data.vec2) {
      vec2.set(bit);
    }

    const contains = vec1.equals(vec2);

    expect(contains).toBe(data.expected);
  });
});
