import { World } from '@heliks/ecs';
import { Hierarchy, Parent } from '@heliks/ecs-hierarchy';
import { Transform } from '../transform';
import { TransformSystem } from '../transform-system';


describe('TransformSystem', () => {
  let hierarchy: Hierarchy;
  let system: TransformSystem;
  let world: World;

  beforeEach(() => {
    hierarchy = new Hierarchy();
    world = new World();
    system = new TransformSystem(hierarchy);

    // Automatically boot the system as we'll need it for every test.
    system.boot(world);
  });

  it('should update world position of children', () => {
    const transform = new Transform(0, 0);

    transform.local.x = 10;
    transform.local.y = 10;

    const parent = world.insert(new Transform(5, 5));

    hierarchy.addChild(
      parent,
      world
        .create()
        .use(transform)
        .use(new Parent(parent))
        .build()
    );

    system.transform(parent);

    expect(transform.world).toMatchObject({
      x: 15,
      y: 15
    });
  })

  it('should recursively update world position of children', () => {
    const transform1 = new Transform(0, 0, 0, 5, 5);
    const transform2 = new Transform(0, 0, 0, 5, 5);

    // Entity B is a Child of Entity A. Entity C is a child of Entity B.
    // A -> B -> C
    const entityA = world.create().use(new Transform(5, 5, 0, 0, 0)).build();
    const entityB = world.create().use(transform1).use(new Parent(entityA)).build();
    const entityC = world.create().use(transform2).use(new Parent(entityB)).build();

    // Add entities to hierarchy.
    hierarchy.addChild(entityA, entityB);
    hierarchy.addChild(entityB, entityC);

    system.transform(entityA);

    expect(transform1.world).toMatchObject({ x: 10, y: 10 });
    expect(transform2.world).toMatchObject({ x: 15, y: 15 });
  });

  it('should transform entities that have children', () => {
    system.transform = jest.fn();

    const parent1 = world.insert(new Transform());
    const parent2 = world.insert(new Transform());

    system.query.add(parent1);
    system.query.add(parent2);

    // Update the system
    system.update();

    expect(system.transform).toHaveBeenCalledWith(parent1);
    expect(system.transform).toHaveBeenCalledWith(parent2);
  });
});
