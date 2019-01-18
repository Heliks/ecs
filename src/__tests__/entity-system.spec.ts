import EntitySystem from "../entity-system";
import World from "../world";
import { TestComp1, TestComp2 } from "./shared";

class TestSystem extends EntitySystem {

    public called: boolean = false;

    constructor() {
        super({ contains: [ TestComp1, TestComp2 ] });
    }

    run(): void {
        this.called = true;
    }

}

describe('EntitySystem', () => {
    const world = new World();

    it('should be called on world update', () => {
        const system = new TestSystem();

        world.addSystem(system);
        world.update(0);

        expect(system.called).toBeTruthy();
    });

    it('should pool entities', () => {
        const system = new TestSystem();

        world.addSystem(system);

        const entity1 = world.entityManager.create();
        const entity2 = world.entityManager.create();

        world.addComponent(entity1, TestComp1);
        world.addComponent(entity1, TestComp2);

        world.addComponent(entity2, TestComp1);
        world.addComponent(entity2, TestComp2);
        world.removeComponent(entity2, TestComp2);

        world.update(0);

        expect(system.getPool().has(entity1)).toBeTruthy();
        expect(system.getPool().has(entity2)).toBeFalsy();
    });
});