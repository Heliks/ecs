import { Hierarchy } from '../hierarchy';


describe('Hierarchy', () => {
  let hierarchy: Hierarchy;

  beforeEach(() => {
    hierarchy = new Hierarchy();
  });

  it('should return a flat hierarchy of all children of an entity', () => {
    const a = 0;
    const b = 1;
    const c = 3;
    const d = 4;
    const e = 5;

    hierarchy.addChild(a, b);
    hierarchy.addChild(b, c);
    hierarchy.addChild(b, d);
    hierarchy.addChild(c, e);

    const children = hierarchy.flat(a).sort();

    expect(children).toEqual([ b, c, d, e ]);
  });
});
