import { EntityPool } from '../decorators';
import EntitySystem from "../entity-system";
import { Entity } from '../types';
import World from "../world";
import { TestComp1, TestComp2, TestComp3 } from "./shared";

describe('EntitySystem', () => {
    @EntityPool({
        contains: [
            TestComp1,
            TestComp2
        ]
    })
    class TestSystem extends EntitySystem {}

    let entity: Entity;
    let system: TestSystem;
    let world: World;

    beforeEach(() => {
        system = new TestSystem();

        world = new World();
        world.addSystem(system);

        entity = world.create();
    });

    it('should pool entities that match the systems filter', () => {
        world.addComponent(entity, TestComp1);
        world.addComponent(entity, TestComp2);
        world.update();

        expect(system.getPool().has(entity)).toBeTruthy();
    });

    it('should not pool entities that don\'t match the systems filter', () => {
        world.addComponent(entity, TestComp2);
        world.addComponent(entity, TestComp3);

        expect(system.getPool().has(entity)).toBeFalsy();
    });

    it('should use a custom entity queries', () => {
        const system = new TestSystem({
            contains: [ TestComp3 ]
        });

        world.addSystem(system);

        world.addComponent(entity, TestComp3);
        world.update();

        expect(system.getPool().has(entity)).toBeTruthy();
    });
});