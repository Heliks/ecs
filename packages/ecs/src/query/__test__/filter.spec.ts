import { Filter } from '../filter';
import { BitSet } from '../../common';


describe('Filter', () => {

  it('should check if two filters are equal', () => {
    const filterA = new Filter();
    const filterB = new Filter();

    filterA.inclusions.add(1);
    filterA.inclusions.add(2);
    filterA.exclusions.add(4);

    filterB.inclusions.add(1);
    filterB.inclusions.add(2);
    filterB.exclusions.add(4);

    expect(filterA.equals(filterB)).toBeTruthy();
  });

  it.each([
    {
      composition: 1 | 2,
      inclusions: 1 | 2,
      exclusions: 0,
      expected: true
    },
    {
      composition: 1 | 2 | 8,
      inclusions: 1 | 2,
      exclusions: 4 | 8,
      expected: false
    }
  ])('should check if compositions $composition includes $inclusions and excludes $exclusions', (item) => {
    const filter = new Filter(
      new BitSet(item.inclusions),
      new BitSet(item.exclusions)
    );

    const test = new BitSet(item.composition);

    expect(filter.test(test)).toBe(item.expected);
  });
});
