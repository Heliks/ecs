import { World } from '../world';
import { SystemManager } from '../system-manager';
import { System } from '../system';

describe('SystemManager', () => {
    let world: World;
    let systems: SystemManager;

    class TestSystem implements System {
        boot = jest.fn();
        update = jest.fn();
    }

    beforeEach(() => {
        world = new World();
        systems = new SystemManager(world);
    });

    it('should call boot() when a system is added', () => {
        const system = new TestSystem();

        systems.add(system);

        expect(system.boot).toHaveBeenCalledWith(world);
    });

    it('should call update() on all systems', () => {
        const system1 = new TestSystem();
        const system2 = new TestSystem();

        systems.add(system1);
        systems.add(system2);

        systems.update(5);

        expect(system1.update).toHaveBeenCalledWith(world, 5);
        expect(system2.update).toHaveBeenCalledWith(world, 5);
    });
});
