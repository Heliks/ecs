import { Filter } from '../filter';
import { COMPONENT_TYPE_LIMIT, Composition } from '../../entity';


describe('Filter', () => {

  it('should check if two filters are equal', () => {
    const filterA = new Filter();
    const filterB = new Filter();

    filterA.inclusions.set(0);
    filterA.inclusions.set(1);
    filterA.exclusions.set(2);

    filterB.inclusions.set(0);
    filterB.inclusions.set(1);
    filterB.exclusions.set(2);

    expect(filterA.equals(filterB)).toBeTruthy();
  });

  it.each([
    {
      composition: [0, 1],
      inclusions: [0, 1],
      exclusions: [],
      expected: true
    },
    {
      composition: [0, 1, 3],
      inclusions: [0, 1],
      exclusions: [2, 3],
      expected: false
    }
  ])('should check if compositions $composition includes $inclusions and excludes $exclusions', data => {
    const composition = Composition.fromArray(COMPONENT_TYPE_LIMIT, data.composition);
    const filter = new Filter(
      Composition.fromArray(COMPONENT_TYPE_LIMIT, data.inclusions),
      Composition.fromArray(COMPONENT_TYPE_LIMIT, data.exclusions)
    );

    expect(filter.test(composition)).toBe(data.expected);
  });
});
