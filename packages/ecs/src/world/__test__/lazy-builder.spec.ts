import { World } from '../world';

describe('LazyBuilder', () => {
  // Test components
  class A {}
  class B {}

  let world: World;

  beforeEach(() => {
    world = new World();
  });

  it('should build entities', () => {
    const entity = world.lazy().build();

    expect(world.alive(entity)).toBeTruthy();
  });

  it('should add components', () => {
    const entity = world
      .lazy()
      .use(new A())
      .use(new B())
      .build();

    expect(world.storage(A).has(entity)).toBeTruthy();
    expect(world.storage(B).has(entity)).toBeTruthy();
  });
});
