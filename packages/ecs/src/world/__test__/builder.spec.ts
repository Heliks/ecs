import { World } from '../world';

describe('Builder', () => {
  // Test components
  class A {}
  class B {}

  let world: World;

  beforeEach(() => {
    world = new World();
  });

  it('should build entities', () => {
    const entity = world.builder().build();

    expect(world.alive(entity)).toBeTruthy();
  });

  it('should add components', () => {
    const entity = world
      .builder()
      .use(new A())
      .use(new B())
      .build();

    expect(world.storage(A).has(entity)).toBeTruthy();
    expect(world.storage(B).has(entity)).toBeTruthy();
  });
});


